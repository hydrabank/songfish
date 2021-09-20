const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    metadata: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resume the audio that was being played."),
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
            const player = await client.lavalink.createPlayer(interaction.guild.id)
            
            if (!player.paused && player.playing) return interaction.editReply("An audio is already playing!");
            if (!player.track) return interaction.editReply("There isn't an audio playing right now!");

            player.resume();
        } catch (e) {
            err = true;
            return interaction.editReply(`An exception occurred whilst attempting to resume the song. Try again later.`);
        };

        return interaction.editReply("✅ Resumed the song.");
    }
};