const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Permissions } = require("discord.js-light");
const { Song } = require("@lavaclient/queue/dist/Song");
const { getData } = require("spotify-url-info");
const { LocalizationManager } = require('../lib/StringManagers');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

require("array.prototype.move");

module.exports = {
    metadata: new SlashCommandBuilder()
        .setName("playnext")
        .setDescription("Add audio to the first spot in the queue. Functions similar to the play command.")
        .addStringOption(o => o.setName("audio").setDescription("The playback URL or search term for the audio").setRequired(true)),
    run: async (client, interaction) => {
        await interaction.deferReply();
        if (interaction.options.getString("audio").toLowerCase().includes("squishmallow")) return interaction.editReply("no shut up with your squishmallow shit stfu");
        let err;
        
        if (interaction.member.voice.channelId === null || interaction.member.voice.channelId === undefined) {
            return interaction.editReply(LocalizationManager.localizeString("general", "userNotInVoiceChannel", interaction.locale));
        };

        if (interaction.guild.me.voice.channelId !== null && interaction.guild.me.voice.channelId !== undefined) {
            if (interaction.guild.me.voice.channelId !== interaction.member.voice.channelId) {
                return interaction.editReply(LocalizationManager.localizeString("general", "userNotInBotChannel", interaction.locale));
            };
        };

        const vcType = interaction.guild.channels.cache.get(interaction.member.voice.channelId).type;

        let audioTerm = /^https?:\/\//.test(interaction.options.getString("audio")) ? interaction.options.getString("audio") : `ytsearch:${interaction.options.getString("audio")}`
        let results = [];
        let meta = {};
        const spotifyReg = /^(?:spotify:|(?:https?:\/\/(?:open|play)\.spotify\.com\/))(?:embed)?\/?(album|track|playlist)(?::|\/)((?:[0-9a-zA-Z]){22})/;

        if (audioTerm.startsWith("ytsearch:spotify:")) return interaction.editReply("Spotify URIs are not supported at this time, and Spotify track loading is limited to HTTP/HTTPS URLs.");
        if (!audioTerm.startsWith("ytsearch:")) {
            if (spotifyReg.test(audioTerm)) {
                let spotifyURLExtractorErr;

                const spotifyData = await getData(audioTerm).catch(f => {
                    spotifyURLExtractorErr = true;
                });

                if (spotifyURLExtractorErr) return interaction.editReply("The Spotify track couldn't be found.");
                if (spotifyData.type !== "track") return interaction.editReply("Preliminary support for Spotify is limited to tracks for now. Playlist support will be added soon.");
                
                let spotifyErr;
                const spotifyXonosData = await fetch(`https://xonos.tools/lookup?type=song&spotifyId=${spotifyData.id}`).catch(f => {
                    spotifyErr = true;
                }).then(res => res.json());

                let mimeErr;
                const audioCheck = await fetch(`https://xonos.tools/getSpotifyTrack/download/${spotifyData.id}.mp3`).catch(f => {
                    mimeErr = true;
                });

                audioCheck.mime = mimeErr ? "null" : audioCheck.headers.get("Content-Type");

                if (spotifyErr) meta.thumbnail = null;
                else meta.thumbnail = spotifyXonosData.result.covers.big;

                if (audioCheck.mime !== "audio/mpeg") {
                    audioTerm = `ytsearch:${spotifyData.name} ${spotifyData.artists[0].name}`;
                    meta.isSpotify = true;
                    meta.source = "YouTube";
                    meta.name = `${spotifyData.name} (by "${spotifyData.artists[0].name}")`;
                    meta.spotifyColour = spotifyData.dominantColor;
                    meta.URL = spotifyData.external_urls.spotify;
                    meta.artist = spotifyData.artists[0].name;
                } else {
                    audioTerm = `https://xonos.tools/getSpotifyTrack/download/${spotifyData.id}.mp3`;
                    meta.isSpotify = true;
                    meta.source = "Deezer";
                    meta.name = `${spotifyData.name} (by "${spotifyData.artists[0].name}")`;
                    meta.spotifyColour = spotifyData.dominantColor;
                    meta.URL = spotifyData.external_urls.spotify;
                };
            };
        };
        const ytresults = await client.lavalink.rest.loadTracks(audioTerm);

        if (ytresults.tracks.length <= 0) return interaction.editReply("🚫 No results were found.");
        if (ytresults.loadType === "PLAYLIST_LOADED") {
            track = ytresults.tracks;
            meta.playlist = ytresults.playlistInfo;
            meta.playlist.length = track.length;
            meta.type = "playlist";
            meta.name = meta.playlist.name;
        } else {
            track = [ytresults.tracks[0]];
            if (meta.isSpotify) {
                meta.type = "track";
            } else {
                meta.type = "track";
                meta.name = track[0].info.title;
            };
        };

        try {
            const player = await client.lavalink.manager.fetch(interaction);
            
            if (!interaction.guild.me.voice.channelId) {
                player.connect(interaction.member.voice.channelId);
                if (!interaction.guild.me.voice.deaf) await interaction.guild.me.voice.setDeaf(true);
            };
            if (interaction.guild.me.voice.channelId && !player.connected) {
                player.connect(interaction.member.voice.channelId);
                if (!interaction.guild.me.voice.deaf) await interaction.guild.me.voice.setDeaf(true);
            };
            
            if (vcType === "GUILD_STAGE_VOICE" && interaction.guild.me.voice.suppress) await interaction.guild.me.voice.setSuppressed(false);
            await player.queue.add(track);
            player.queue.tracks.move(player.queue.tracks.length - 1, 0);

            if (!player.playing) {
                await player.queue.start();
            };

            if (meta.isSpotify && meta.source === "Deezer" && meta.type === "track") {
                const thisTrack = new Song(track[0]);
                thisTrack.isSpotify = true;
                thisTrack.title = meta.name;
                thisTrack.spotify = {
                    source: "Deezer",
                    thumbnail: meta.thumbnail,
                    colour: meta.spotifyColour,
                    url: meta.URL
                };

                if (player.queue.current.identifier === thisTrack.identifier) player.queue.current = thisTrack;
                const queueTrackIndex = player.queue.tracks.findIndex(f => f.identifier === new Song(track[0]).identifier);
                const queueTrackLastIndex = player.queue.previous.findIndex(f => f.identifier === new Song(track[0]).identifier);
                if (queueTrackIndex !== -1) player.queue.tracks[queueTrackIndex] = thisTrack;
                if (queueTrackLastIndex !== -1) player.queue.previous[queueTrackLastIndex] = thisTrack;

            } if (meta.isSpotify && meta.source === "YouTube" && meta.type === "track") {
                const thisTrack = new Song(track[0]);
                thisTrack.isSpotify = true;
                thisTrack.title = meta.name;
                thisTrack.spotify = {
                    source: "YouTube",
                    thumbnail: meta.thumbnail,
                    colour: meta.spotifyColour,
                    url: meta.URL
                };

                if (player.queue.current.identifier === thisTrack.identifier) player.queue.current = thisTrack;
                const queueTrackIndex = player.queue.tracks.findIndex(f => f.identifier === new Song(track[0]).identifier);
                const queueTrackLastIndex = player.queue.previous.findIndex(f => f.identifier === new Song(track[0]).identifier);
                if (queueTrackIndex !== -1) player.queue.tracks[queueTrackIndex] = thisTrack;
                if (queueTrackLastIndex !== -1) player.queue.previous[queueTrackLastIndex] = thisTrack;
            };
        } catch (e) {
            if (e.code === 50013 && e.httpStatus === 403 && vcType === "GUILD_STAGE_VOICE") return interaction.editReply("I need the following permissions to join stages: `Manage Channels`, `Mute Members`, `Move Members`. Otherwise, I cannot join stages.");
            if (e.code === 50013 && e.httpStatus === 403) {
                return interaction.editReply("The bot had issues trying to reconnect to the voice channel. If the bot spontaneously stopped itself whilst playing audio and the queue was reset, this is probably because of the bot restarting. Try disconnecting the bot manually, then reconnecting it again.")
            };
            err = true;
            const chalk = require("chalk");
            console.log(`${chalk.red("ERROR")} || Songfish was able to successfully handle an exception (${new Date().toUTCString()}). Here is a debug stack trace in the case that you'd like to see the error:\n${e.stack}`);
            return interaction.editReply(`An exception occurred whilst attempting to play audio. Try again later.`);
        };

        if (err === true) return;
        if (meta.type === "track") return interaction.editReply(`🎵  Added audio: \`${meta.name}\`${meta.isSpotify ? `, fetched from Spotify (using source ${meta.source}).\n\n**Note that Spotify support is in beta, and that some tracks may not be pulled correctly. If this is the case, you may want to find its' YouTube equivalent. Also note that Spotify support is entirely reliant on YouTube and Deezer, so a \"no results found\" error may entail that a version of the audio does not exist on both platforms.**` : ""}`);
        if (meta.type === "playlist") return interaction.editReply(`🎵  Added **${meta.playlist.length}** tracks from playlist \`${meta.name}\``);
    }
};