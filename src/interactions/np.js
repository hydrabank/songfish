const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    metadata: new SlashCommandBuilder()
        .setName("np")
        .setDescription("Get information about the audio currently playing."),
    run: async (client, interaction) => {
        await interaction.deferReply();
        let err;
        if (interaction.member.voice.channelId === null || interaction.member.voice.channelId === undefined) {
            return interaction.editReply("You must be in a voice channel in order to use this command.");
        };

        if (interaction.clientUser.voice.channelId === null || interaction.clientUser.voice.channelId === undefined) {
            return interaction.editReply("I am not currently playing audio in a voice channel!");
        };
        
        if (interaction.clientUser.voice.channelId !== interaction.member.voice.channelId) {
            return interaction.editReply("I am not currently playing audio in the voice channel that you are in!");
        };

        try { 
            const player = await client.lavalink.createPlayer(interaction.guild.id);

            if (!player.track) return interaction.editReply("I'm currently not playing anything!");
            
            return interaction.editReply({ embeds: [
                new MessageEmbed()
                    .setTitle(player.track)
                    .setColor("RANDOM")
                    .setFooter(`Edward Music`, client.user.displayAvatarURL({ dynamic: true, size: 4096 }))
                    .setTimestamp()
                    .setDescription(`${player.paused ? "🚫" : "✅"}`)
            ] });
        } catch (e) {
            err = true;
            return interaction.editReply(`An exception occurred whilst attempting to get information about the song. Try again later.`);
        };
    }
};