const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js-light");
const { LoopType } = require("@lavaclient/queue/dist/Queue");

module.exports = {
    metadata: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Clear the queue. This does not stop the current song."),
    run: async (client, interaction) => {
        await interaction.deferReply();
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
            await player.queue.setLoop(LoopType.None);
            player.queue.tracks = [];
        } catch (e) {
            err = true;
            return interaction.editReply(`An exception occurred whilst attempting to clear the queue. Try again later.`);
        };

        return interaction.editReply("🗑️ Removed all songs from the queue");
    }
};