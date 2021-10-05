const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js-light");
const { createBar } = require('string-progress');
const { duration, format } = require("duration-pretty");
module.exports = {
    metadata: new SlashCommandBuilder()
        .setName("np")
        .setDescription("Get information about the audio currently playing."),
    run: async (client, interaction) => {
        await interaction.deferReply();
        let err;

        if (interaction.guild.me.voice.channelId === null || interaction.guild.me.voice.channelId === undefined) {
            return interaction.editReply("I am not currently playing audio in a voice channel!");
        };

        try { 
            const player = await client.lavalink.manager.fetch(interaction);

            if (player.playing === false) return interaction.editReply("I am not currently playing audio in a voice channel!");

            const track = await client.lavalink.rest.decodeTrack(player.track);

            let point = duration(player.position, "milliseconds");
            if (player.position >= 3600000) point = point.format("HH:mm:ss");
            else point = point.format("mm:ss");

            let total = duration(track.length, "milliseconds");
            if (track.length >= 3600000) total = total.format("HH:mm:ss");
            else total = total.format("mm:ss");

            if (!player.track) return interaction.editReply("I'm currently not playing anything!");

            const embed = new MessageEmbed()
            .setAuthor(`Currently playing audio`, client.user.displayAvatarURL({ dynamic: true, size: 4096 }))
            .setColor("RANDOM")
            .setFooter(`Songfish • Player: P-${player.node.conn.info.port}`, client.user.displayAvatarURL({ dynamic: true, size: 4096 }))
            .setTimestamp();
            
            if (track.isStream) embed.setDescription(`[${track.title}](${track.uri})\n\n${player.paused ? "⏸️" : "▶️"} ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n\n**Live** (listening for ${point})`);
            else embed.setDescription(`[${track.title}](${track.uri})\n\n${player.paused ? "⏸️" : "▶️"} ${createBar(track.length, player.position, { size: 17 })}\n\n${point}/${total}`);

            return interaction.editReply({ embeds: [ embed ] });
        } catch (e) {
            err = true;
            return interaction.editReply(`Oops! Songfish fell into a snag. Songfish can't read metadata about certain audio due to copyright or an illegal character being present. Apologies for the inconvenience.`);
        };
    }
};