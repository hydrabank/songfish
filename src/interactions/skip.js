const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js-light");

module.exports = {
    metadata: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip the audio that is currently playing."),
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
            let player;
            if (interaction.guild.me.voice.channelId === null || interaction.guild.me.voice.channelId === undefined || (await client.lavalink.getPlayer(interaction.guild.id)) === null) player = await client.lavalink.createPlayer(interaction.guild.id);
            else player = await client.lavalink.getPlayer(interaction.guild.id);
            if (!player.track) return interaction.editReply("There isn't an audio playing right now!");
            if (player.queue.tracks.length <= 0) {
                player.queue.tracks = [];
                player.queue.current = null;
                await player.queue.next();
                await player.stop();
                await player.disconnect();
                await player.connect(interaction.member.voice.channelId);
                return interaction.editReply("There are no more audios in the queue. Add more to keep the bot in the channel! (Note that your current song may still be in the queue after playing a new song. Make sure to skip the song. We're working on a fix for this.)");
            };

            player.queue.next();
        } catch (e) {
            console.log(e)
            err = true;
            return interaction.editReply(`An exception occurred whilst attempting to skip the audio. Try again later.`);
        };

        return interaction.editReply("⏭️ Skipped the audio.");
    }
};