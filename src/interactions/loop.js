const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js-light");
const { LocalizationManager } = require('../lib/StringManagers');

module.exports = {
    metadata: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Loop the audio that is currently playing, or loop the queue.")
        .addStringOption(o =>
            o.setName("mode")
                .setDescription("The loop mode")
                .setRequired(true)
                .addChoices(
                    { name: "Queue", value: "Queue" },
                    { name: "Audio", value: "Song" },
                    { name: "Disable", value: "None" }
                )),
    run: async (client, interaction) => {
        const { LoopType } = require("@lavaclient/queue/dist/Queue");
        await interaction.deferReply();

        const mode = interaction.options.getString("mode");

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
            if (!player.track) return interaction.editReply(LocalizationManager.localizeString("general", "noAudioPlayingInVC", interaction.locale));
            await player.queue.setLoop(LoopType[mode]);
        } catch (e) {
            err = true;
            const chalk = require("chalk");
            console.log(`${chalk.red("ERROR")} || Songfish was able to successfully handle an exception (${new Date().toUTCString()}). Here is a debug stack trace in the case that you'd like to see the error:\n${e.stack}`);
            return interaction.editReply(LocalizationManager.localizeString("loop", "error", interaction.locale));
        };

        if (mode === "Queue") return interaction.editReply(LocalizationManager.localizeString("loop", "successQueue", interaction.locale));
        if (mode === "Song") return interaction.editReply(LocalizationManager.localizeString("loop", "successSingle", interaction.locale));
        if (mode === "None") return interaction.editReply(LocalizationManager.localizeString("loop", "successStop", interaction.locale));
    }
};