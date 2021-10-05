const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js-light");
const { LoopType } = require("@lavaclient/queue/dist/Queue");

module.exports = {
    metadata: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Loop the audio that is currently playing, or loop the queue.")
        .addStringOption(o =>
            o.setName("mode")
                .setDescription("The loop mode")
                .setRequired(true)
                .addChoice("Queue", "Queue")
                .addChoice("Audio", "Song")
                .addChoice("Disable", "None")),
    run: async (client, interaction) => {
        await interaction.deferReply();

        const mode = interaction.options.getString("mode");

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
            await player.queue.setLoop(LoopType[mode]);
        } catch (e) {
            err = true;
            return interaction.editReply(`An exception occurred whilst attempting to loop the audio. Try again later.`);
        };

        if (mode === "Queue") return interaction.editReply("🔁 Songfish is now playing in queue-loop mode.");
        if (mode === "Song") return interaction.editReply("🔂 Songfish is now playing in single-loop mode.");
        if (mode === "None") return interaction.editReply("➡️ Songfish is now playing in queue mode.");
    }
};