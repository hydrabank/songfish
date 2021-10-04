const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js-light");

module.exports = {
    metadata: new SlashCommandBuilder()
        .setName("disconnect")
        .setDescription("Disconnect the bot from the voice channel that it is currently in."),
    run: async (client, interaction) => {
        await interaction.deferReply();
        let err;
        if (interaction.member.voice.channelId === null || interaction.member.voice.channelId === undefined) {
            return interaction.editReply("You must be in a voice channel in order to use this command.");
        };

        if (interaction.guild.me.voice.channelId === null || interaction.guild.me.voice.channelId === undefined) {
            return interaction.editReply("I am not currently in a voice channel!");
        };
        
        if (interaction.guild.me.voice.channelId !== interaction.member.voice.channelId) {
            return interaction.editReply("I am not currently playing audio in the voice channel that you are in!");
        };

        try { 
            let player;
            if (interaction.guild.me.voice.channelId === null || interaction.guild.me.voice.channelId === undefined || (await client.lavalink.getPlayer(interaction.guild.id)) === null) player = await client.lavalink.createPlayer(interaction.guild.id);
            else player = await client.lavalink.getPlayer(interaction.guild.id);
            player.disconnect();
            
            await client.lavalink.destroyPlayer(interaction.guild.id);
        } catch (e) {
            err = true;
            return interaction.editReply(`An exception occurred whilst attempting to disconnect the bot. Try again later.`);
        };

        return interaction.editReply("🚫 Disconnected from your voice channel.");
    }
};