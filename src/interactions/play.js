const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js-light");
const { Song } = require("@lavaclient/queue/dist/Song");
const { SpotifyItemType } = require("@lavaclient/spotify");
module.exports = {
    metadata: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play audio. Supports YouTube.")
        .addStringOption(o => o.setName("audio").setDescription("The playback URL or search term for the audio").setRequired(true)),
    run: async (client, interaction) => {
        await interaction.deferReply();
        if (interaction.options.getString("audio").toLowerCase().includes("squishmallow")) return interaction.editReply("no shut up with your squishmallow shit stfu");
        let err;
        if (interaction.member.voice.channelId === null || interaction.member.voice.channelId === undefined) {
            return interaction.editReply("You must be in a voice channel in order to use this command.");
        };

        if (interaction.clientUser.voice.channelId !== null && interaction.clientUser.voice.channelId !== undefined) {
            if (interaction.clientUser.voice.channelId !== interaction.member.voice.channelId) {
                return interaction.editReply("You must be in the same voice channel as the bot in order to play audio!");
            };
        };

        let results = [];
        let meta = {};

        if (client.lavalink.spotify.isSpotifyUrl(interaction.options.getString("audio"))) {
            const trackList = await client.lavalink.spotify.load(interaction.options.getString("audio"));
            
            switch (trackList.type) {
                default:
                    meta = false;
                    break;

                case SpotifyItemType.Track:
                    meta.name = trackList.name;
                    meta.type = trackList.type;
                    const track = await trackList.resolveYoutubeTrack();
                    results = [track];
                    break;
                
                case SpotifyItemType.Album:
                case SpotifyItemType.Playlist:
                    meta.name = trackList.name;
                    meta.type = trackList.type;
                    results = await trackList.resolveYoutubeTracks();
                    break;
                
                case SpotifyItemType.Artist:
                    meta.name = trackList.name;
                    meta.type = trackList.type;
                    results = await trackList.resolveYoutubeTracks();
                    break;
            };

            try {
                const player = await client.lavalink.createPlayer(interaction.guild.id)
    
                if (!player.connected || !interaction.clientUser.voice.channelId) player.connect(interaction.member.voice.channelId);
    
                await player.queue.add(results);
    
                if (!player.playing) {
                    await player.queue.start();
                };
    
                if (player.paused) {
                    await player.resume();
                };
                
            } catch (e) {
                err = true;
                return interaction.editReply(`An exception occurred whilst attempting to play audio. Try again later.`);
            };

        } else {
            const ytresults = await client.lavalink.rest.loadTracks(/^https?:\/\//.test(interaction.options.getString("audio")) ? interaction.options.getString("audio") : `ytsearch:${interaction.options.getString("audio")}`);
            if (ytresults.tracks.length <= 0) return interaction.editReply("🚫 No results were found.");
            
            const track = ytresults.tracks[0];
            
            meta.name = track.info.title;

            try {
                const player = await client.lavalink.createPlayer(interaction.guild.id)
    
                if (!player.connected) player.connect(interaction.member.voice.channelId);
    
                await player.queue.add([ track ]);
    
                if (!player.playing) {
                    await player.queue.start();
                };
    
                if (player.paused) {
                    await player.resume();
                };
                
            } catch (e) {
                err = true;
                return interaction.editReply(`An exception occurred whilst attempting to play audio. Try again later.`);
            };
        };

        if (err === true) return;
        return interaction.editReply(`🎵  Added song: \`${meta.name}\``);
    }
};