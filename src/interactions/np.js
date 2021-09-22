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
        if (interaction.member.voice.channelId === null || interaction.member.voice.channelId === undefined) {
            return interaction.editReply("You must be in a voice channel in order to use this command.");
        };

        if (interaction.clientUser.voice.channelId === null || interaction.clientUser.voice.channelId === undefined) {
            return interaction.editReply("I am not currently playing audio in a voice channel!");
        };
        
        if (interaction.clientUser.voice.channelId !== interaction.member.voice.channelId) {
            return interaction.editReply("I am not currently playing audio in the voice channel that you are in!");
        };

        try { 
            const player = await client.lavalink.createPlayer(interaction.guild.id);
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
                    .setFooter(`Edward Music`, client.user.displayAvatarURL({ dynamic: true, size: 4096 }))
                    .setTimestamp()
                    .setDescription(`[${track.title}](${track.uri})\n\n${createBar(track.length, player.position, { size: 17 })} (${track.paused ? "🔴" : "🟢"})\n\n${point}/${total}`)
            ] });
        } catch (e) {
            err = true;
            return interaction.editReply(`An exception occurred whilst attempting to get information about the song. Try again later.`);
        };
    }
};