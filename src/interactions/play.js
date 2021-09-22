const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js-light");

module.exports = {
    metadata: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play audio. Supports YouTube.")
        .addStringOption(o => o.setName("audio").setDescription("The playback URL or search term for the audio").setRequired(true)),
    run: async (client, interaction) => {
        await interaction.deferReply();
        let err;
        if (interaction.member.voice.channelId === null || interaction.member.voice.channelId === undefined) {
            return interaction.editReply("You must be in a voice channel in order to use this command.");
        };

        if (interaction.clientUser.voice.channelId !== null && interaction.clientUser.voice.channelId !== undefined) {
            if (interaction.clientUser.voice.channelId !== interaction.member.voice.channelId) {
                return interaction.editReply("You must be in the same voice channel as the bot in order to play audio!");
            };
        };

        const results = await client.lavalink.rest.loadTracks(`ytsearch:${interaction.options.getString("audio")}`);
        if (results.length === 0) return interaction.editReply("🚫 No results were found.");
        const track = results.tracks[0];
        try {
            if (interaction.clientUser.voice.channelId === interaction.member.voice.channelId) {
                await client.lavalink.createPlayer(interaction.guild.id)
                    .stop();
            };
            
            await client.lavalink.createPlayer(interaction.guild.id)
                .connect(interaction.member.voice.channelId)
                .play(track);
        } catch (e) {
            err = true;
            return interaction.editReply(`An exception occurred whilst attempting to play audio. Try again later.`);
        };

        if (err === true) return;
        return interaction.editReply(`🎵  Now playing: \`${track.info.title}\``);
    }
};