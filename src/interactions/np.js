const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js-light");
const { createBar } = require('string-progress');
const { duration, format } = require("duration-pretty");
const { LocalizationManager } = require('../lib/StringManagers');

module.exports = {
    metadata: new SlashCommandBuilder()
        .setName("np")
        .setDescription("Get information about the audio currently playing."),
    run: async (client, interaction) => {
        await interaction.deferReply();
        let err;

        if (interaction.guild.me.voice.channelId === null || interaction.guild.me.voice.channelId === undefined) {
            return interaction.editReply(LocalizationManager.localizeString("general", "notPlayingAudio", interaction.locale));
        };

        try { 
            const player = await client.lavalink.manager.fetch(interaction);

            if (player.playing === false) return interaction.editReply(LocalizationManager.localizeString("general", "notPlayingAudio", interaction.locale));

            const track = player.queue.current;
            let thumbnail = client.lavalink.manager.youtube.getThumbnail(track.uri);
            if (thumbnail === null) thumbnail = {
                small: "https://img.youtube.com/vi/none/default.jpg",
                medium: "https://img.youtube.com/vi/none/mqdefault.jpg",
                large: "https://img.youtube.com/vi/none/hqdefault.jpg",
                maximum: "https://img.youtube.com/vi/none/maxresdefault.jpg"
            };
            let point = duration(player.position, "milliseconds");
            if (player.position >= 3600000) point = point.format("HH:mm:ss");
            else point = point.format("mm:ss");

            let total = duration(track.length, "milliseconds");
            if (track.length >= 3600000) total = total.format("HH:mm:ss");
            else total = total.format("mm:ss");

            if (!player.track) return interaction.editReply(LocalizationManager.localizeString("general", "noAudioPlayingInVC", interaction.locale));

            const embed = new MessageEmbed()
            .setAuthor({ name: LocalizationManager.localizeString("nowplaying", "AuthorTitle", interaction.locale), iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
            .setColor("RANDOM")
            .setFooter({ text: `Songfish • Player: P-${player.node.conn.info.port}`, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
            .setImage(thumbnail.maximum)
            .setTimestamp();
            
            if (track.isStream) embed.setDescription(
                `[${track.title}](${track.uri})\n\n${player.paused ? "⏸️" : "▶️"} ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n\n**${LocalizationManager.localizeString("nowplaying", "WordLive", interaction.locale)}** (${LocalizationManager.localizeString("nowplaying", "WordListeningFor", interaction.locale)} ${point})`
            );
            else embed.setDescription(`[${track.title}](${track.uri})\n\n${player.paused ? "⏸️" : "▶️"} ${createBar(track.length, player.position, { size: 17 })}\n\n${point}/${total}`);
            if (track.isSpotify) embed.setDescription(`[${track.title}](${track.spotify.url})\n\n${player.paused ? "⏸️" : "▶️"} ${createBar(track.length, player.position, { size: 17 })}\n\n${point}/${total}`).setImage(thumbnail.null).setColor(track.spotify.colour).setThumbnail(track.spotify.thumbnail);

            return interaction.editReply({ embeds: [ embed ] });
        } catch (e) {
            err = true;
            const chalk = require("chalk");
            console.log(`${chalk.red("ERROR")} || Songfish was able to successfully handle an exception (${new Date().toUTCString()}) (COMMAND: NOW PLAYING). Here is a debug stack trace in the case that you'd like to see the error:\n${e.stack}`);
            return interaction.editReply(LocalizationManager.localizeString("nowplaying", "error", interaction.locale));
        };
    }
};