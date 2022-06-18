const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js-light");
const { LocalizationManager } = require('../lib/StringManagers');

module.exports = {
    metadata: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pause the audio that is currently playing."),
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
            if (player.paused) return interaction.editReply(LocalizationManager.localizeString("pause", "alreadyPaused", interaction.locale));
            if (!player.track) return interaction.editReply(LocalizationManager.localizeString("general", "noAudioPlayingInVC", interaction.locale));
            player.pause();
        } catch (e) {
            err = true;
            const chalk = require("chalk");
            console.log(`${chalk.red("ERROR")} || Songfish was able to successfully handle an exception (${new Date().toUTCString()}). Here is a debug stack trace in the case that you'd like to see the error:\n${e.stack}`);
            return interaction.editReply(LocalizationManager.localizeString("pause", "error", interaction.locale));
        };

        return interaction.editReply(LocalizationManager.localizeString("pause", "success", interaction.locale));
    }
};