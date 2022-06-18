const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js-light");
const { LocalizationManager } = require('../lib/StringManagers');

module.exports = {
    metadata: new SlashCommandBuilder()
        .setName("join")
        .setDescription("Have Songfish join the voice channel that you are in."),
    run: async (client, interaction) => {
        await interaction.deferReply();
        let err;
        if (interaction.member.voice.channelId === null || interaction.member.voice.channelId === undefined) {
            return interaction.editReply(LocalizationManager.localizeString("general", "userNotInVoiceChannel", interaction.locale));
        };

        if (interaction.guild.me.voice.channelId !== null && interaction.guild.me.voice.channelId !== undefined) {
            if (interaction.guild.me.voice.channelId !== interaction.member.voice.channelId) return interaction.editReply(LocalizationManager.localizeString("general", "userNotInBotChannel", interaction.locale));
        };

        const vcType = interaction.guild.channels.cache.get(interaction.member.voice.channelId).type;

        try { 
                const player = await client.lavalink.manager.fetch(interaction);
                if (player.connected) return interaction.editReply(LocalizationManager.localizeString("join", "alreadyConnected", interaction.locale));
                await player.connect(interaction.member.voice.channelId);

                if (vcType === "GUILD_STAGE_VOICE" && interaction.guild.me.voice.suppress) await interaction.guild.me.voice.setSuppressed(false);

                if (!interaction.guild.me.voice.deaf) await interaction.guild.me.voice.setDeaf(true);
        } catch (e) {
            if (e.code === 50013 && e.httpStatus === 403 && vcType === "GUILD_STAGE_VOICE") return interaction.editReply("I need the following permissions to join stages: `Manage Channels`, `Mute Members`, `Move Members`. Otherwise, I cannot join stages.");
            if (e.code === 50013 && e.httpStatus === 403) {
                return interaction.editReply("The bot had issues trying to reconnect to the voice channel. If the bot spontaneously stopped itself whilst playing audio and the queue was reset, this is probably because of the bot restarting. Try disconnecting the bot manually, then reconnecting it again.")
            };
            err = true;
            const chalk = require("chalk");
            console.log(`${chalk.red("ERROR")} || Songfish was able to successfully handle an exception (${new Date().toUTCString()}). Here is a debug stack trace in the case that you'd like to see the error:\n${e.stack}`);
            return interaction.editReply(LocalizationManager.localizeString("join", "error", interaction.locale));
        };
        
        return interaction.editReply(`${LocalizationManager.localizeString("join", "success", interaction.locale, `<#${interaction.member.voice.channelId}>`)}`);
    }
};