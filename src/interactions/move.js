const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js-light");
const { LocalizationManager } = require('../lib/StringManagers');

require("array.prototype.move");

module.exports = {
    metadata: new SlashCommandBuilder()
        .setName("move")
        .setDescription("Move an audio to a different position in the queue.")
        .addIntegerOption(option => option.setName("audio").setDescription('Enter the number that corresponds to your track\'s position in the queue').setRequired(true))
        .addIntegerOption(option => option.setName("position").setDescription('Enter the number that corresponds to your track\'s desired position in the queue').setRequired(true)),
    run: async (client, interaction) => {
        /*await interaction.deferReply();

        const audio = interaction.options.getInteger("audio") - 1;
        const position = interaction.options.getInteger("position") - 1;

        let err;
        if (interaction.member.voice.channelId === null || interaction.member.voice.channelId === undefined) {
            return interaction.editReply("You must be in a voice channel in order to use this command.");
        };

        if (interaction.guild.me.voice.channelId === null || interaction.guild.me.voice.channelId === undefined) {
            return interaction.editReply("I am not currently playing audio in a voice channel!");
        };
        
        if (interaction.guild.me.voice.channelId !== interaction.member.voice.channelId) {
            return interaction.editReply("I am not currently playing audio in the voice channel that you are in!");
        };

        try { 
            const player = await client.lavalink.manager.fetch(interaction);
            if (!player.track) return interaction.editReply("There isn't an audio playing right now!");
            player.queue.tracks.move(audio, position);

            return interaction.editReply(`Song \`${player.queue.tracks[audio].title}\` was moved to position \`${position + 1}\`.`);
        } catch (e) {
            err = true;
            const chalk = require("chalk");
            console.log(`${chalk.red("ERROR")} || Songfish was able to successfully handle an exception (${new Date().toUTCString()}). Here is a debug stack trace in the case that you'd like to see the error:\n${e.stack}`);
            return interaction.editReply(`An exception occurred whilst attempting to move a song in the queue. Try again later.`);
        };*/

        return interaction.reply("Move is currently unimplemented for various reasons. Sorry for the inconvenience.");
    }
};