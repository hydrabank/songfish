const { SlashCommandBuilder } = require("@discordjs/builders");
const { LocalizationManager } = require('../lib/StringManagers');
const { MessageEmbed } = require("discord.js-light");
const { LoopType } = require("@lavaclient/queue/dist/Queue");

module.exports = {
    metadata: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("See the next five songs in the queue."),
    run: async (client, interaction) => {
        await interaction.deferReply();

        let err;

        if (interaction.guild.me.voice.channelId === null || interaction.guild.me.voice.channelId === undefined) {
            return interaction.editReply(LocalizationManager.localizeString("general", "notPlayingAudio", interaction.locale));
        };

        try { 
            const player = await client.lavalink.manager.fetch(interaction);
            const queue = player.queue.tracks.slice(0, 5);
            
            const embed = new MessageEmbed()
                .setColor("AQUA")
                .setTitle(`${interaction.guild.name}: Queue`)
                .setFooter({ text: `Songfish • Player: P-${player.node.conn.info.port}`, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
                .setTimestamp()
                .setDescription(("```nim\n" + queue.map(track => { 
                    return `${queue.indexOf(track) + 1}: ${track.title}`
                }).join("\n") + "\n```").slice(0, 1020))
                .addField(LocalizationManager.localizeString("queue", "WordSongsLeftInQueue", interaction.locale), `\`${player.queue.tracks.length}\``, true)
                .addField(LocalizationManager.localizeString("queue", "WordLoopStatus", interaction.locale), "`" + LoopType[player.queue.loop.type] + "`", true);
                
            if (queue.length <= 0) embed.setDescription("```"+ LocalizationManager.localizeString("queue", "WordQueueEmpty", interaction.locale) + "```");
            return interaction.editReply({ embeds: [embed] });
        } catch (e) {
            err = true;
            const chalk = require("chalk");
            console.log(`${chalk.red("ERROR")} || Songfish was able to successfully handle an exception (${new Date().toUTCString()}). Here is a debug stack trace in the case that you'd like to see the error:\n${e.stack}`);
            return interaction.editReply(`An exception occurred whilst attempting to display the queue. Try again later.`);
        };
    }
};