const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js-light");
const { LocalizationManager } = require('../lib/StringManagers');

module.exports = {
    metadata: new SlashCommandBuilder()
        .setName("remove")
        .setDescription("Remove an audio from the queue.")
        .addNumberOption(o => o.setName("number").setDescription("The position of the audio in the queue").setRequired(true)),
    run: async (client, interaction) => {
        await interaction.deferReply();

        const num = interaction.options.getNumber("number");

        let err;

        if (interaction.guild.me.voice.channelId === null || interaction.guild.me.voice.channelId === undefined) {
            return interaction.editReply(LocalizationManager.localizeString("general", "notPlayingAudio", interaction.locale));
        };

        try { 
            const player = await client.lavalink.manager.fetch(interaction);

            if (player.queue.tracks.length === 0) return interaction.editReply("There are no audios in the queue!");
            if (num > player.queue.tracks.length) return interaction.editReply("The audio that you provided does not exist in the queue!");
            if (num <= 0) return interaction.editReply("The audio that you provided does not exist in the queue!");

            await player.queue.remove(num - 1);
            return interaction.editReply(`Removed audio #${num} from the queue.`);
        } catch (e) {
            err = true;
            const chalk = require("chalk");
            console.log(`${chalk.red("ERROR")} || Songfish was able to successfully handle an exception (${new Date().toUTCString()}). Here is a debug stack trace in the case that you'd like to see the error:\n${e.stack}`);
            return interaction.editReply(`An exception occurred whilst attempting to remove audio #${num}. Try again later.`);
        };
    }
};