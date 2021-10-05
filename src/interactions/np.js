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
            let player;
            if (interaction.guild.me.voice.channelId === null || interaction.guild.me.voice.channelId === undefined || (await client.lavalink.getPlayer(interaction.guild.id)) === null) player = await client.lavalink.createPlayer(interaction.guild.id);
            else player = await client.lavalink.getPlayer(interaction.guild.id);

            if (player.playing === false) return interaction.editReply("I am not currently playing audio in a voice channel!");

            const track = await client.lavalink.rest.decodeTrack(player.track);

            let point = duration(player.position, "milliseconds");
            if (player.position >= 3600000) point = point.format("HH:mm:ss");
            else point = point.format("mm:ss");

            let total = duration(track.length, "milliseconds");
            if (track.length >= 3600000) total = total.format("HH:mm:ss");
            else total = total.format("mm:ss");

            if (!player.track) return interaction.editReply("I'm currently not playing anything!");

            return interaction.editReply({ embeds: [
                new MessageEmbed()
                    .setAuthor(`Currently playing audio`, client.user.displayAvatarURL({ dynamic: true, size: 4096 }))
                    .setColor("RANDOM")
                    .setFooter(`Songfish • Player: P-${player.node.conn.info.port}`, client.user.displayAvatarURL({ dynamic: true, size: 4096 }))
                    .setTimestamp()
                    .setDescription(`[${track.title}](${track.uri})\n\n${player.paused ? "⏸️" : "▶️"} ${createBar(track.length, player.position, { size: 17 })}\n\n${point}/${total}`)
            ] });
        } catch (e) {
            err = true;
            return interaction.editReply(`Oops! Songfish fell into a snag. Songfish can't read metadata about certain songs due to copyright or an illegal character being present. Apologies for the inconvenience.`);
        };
    }
};