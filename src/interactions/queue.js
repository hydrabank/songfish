const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js-light");
const { LoopType } = require("@lavaclient/queue/dist/Queue");

module.exports = {
    metadata: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("See the next five songs in the queue."),
    run: async (client, interaction) => {
        await interaction.deferReply();

        const mode = interaction.options.getString("mode");

        let err;

        if (interaction.guild.me.voice.channelId === null || interaction.guild.me.voice.channelId === undefined) {
            return interaction.editReply("I am not currently playing audio in a voice channel!");
        };

        try { 
            const player = await client.lavalink.createPlayer(interaction.guild.id);
            const queue = player.queue.tracks.slice(0, 5);

            const embed = new MessageEmbed()
                .setColor("AQUA")
                .setTitle(`${interaction.guild.name}: Queue`)
                .setFooter(`Songfish • Player: P-${player.node.conn.info.port}`, client.user.displayAvatarURL({ dynamic: true, size: 4096 }))
                .setTimestamp()
                .setDescription(("```nim\n" + queue.map(track => `${queue.indexOf(track) + 1}: ${track.title}`).join("\n") + "\n```").slice(0, 1020))
                .addField("Loop status", "`" + LoopType[player.queue.loop.type].replace("Song", "Audio") + "`");
                
            if (queue.length <= 0) embed.setDescription("```The queue is empty.```");
            return interaction.editReply({ embeds: [embed] });
        } catch (e) {
            err = true;
            return interaction.editReply(`An exception occurred whilst attempting to display the queue. Try again later.`);
        };
    }
};