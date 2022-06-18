const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js-light");
const { LocalizationManager } = require('../lib/StringManagers');

module.exports = {
    metadata: new SlashCommandBuilder()
        .setName("disconnect")
        .setDescription("Disconnect the bot from the voice channel that it is currently in."),
    run: async (client, interaction) => {
        await interaction.deferReply();
        let err;
        
        if (interaction.member.voice.channelId === null || interaction.member.voice.channelId === undefined) {
            return interaction.editReply(LocalizationManager.localizeString("general", "userNotInVoiceChannel", interaction.locale));
        };

        if (interaction.guild.me.voice.channelId === null || interaction.guild.me.voice.channelId === undefined) {
            return interaction.editReply(LocalizationManager.localizeString("general", "notPlayingAudio", interaction.locale));
        };
        
        if (interaction.guild.me.voice.channelId !== interaction.member.voice.channelId) {
            return interaction.editReply(LocalizationManager.localizeString("general", "userNotInBotChannel", interaction.locale));
        };

        try { 
            const player = await client.lavalink.manager.fetch(interaction);
            player.queue.clear();
            player.disconnect();
            
            await client.lavalink.destroyPlayer(interaction.guild.id);
        } catch (e) {
            err = true;
            return interaction.editReply(LocalizationManager.localizeString("disconnect", "error", interaction.locale));
        };

        return interaction.editReply(LocalizationManager.localizeString("disconnect", "success", interaction.locale));
    }
};