const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js-light");

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
            return interaction.editReply("I am not currently playing audio in a voice channel!");
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
            return interaction.editReply(`An exception occurred whilst attempting to remove audio #${num}. Try again later.`);
        };
    }
};