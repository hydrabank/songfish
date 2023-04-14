import { ActionRowBuilder, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import TimeFormat from "../../lib/TimeFormat";

import { metadata as nowPlayingLeave } from "../buttons/nowPlayingLeave";

const metadata = {
    name: "queue",
    type: "CommandInteraction",
    proctorOnly: false,
    dmCommand: false,
    builder: new SlashCommandBuilder()
        .setDescription("Get information about the currently-playing track."),
    i18n: {
        "default": {
            notInVoiceChannel: "🤔 I'm not in a voice channel!",
            notPlaying: "🚫 I'm not playing anything right now",
            queue: {
                title: "What's up next?",
                author: "🎵 %s's queue",
                wrapper: `${"```md"}\n%Q\n${"```"}`,
            }
        }
    }
};

async function execute(ctx, interaction) {
    await interaction.deferReply();
    if (!interaction.guild?.members?.me?.voice.channel) {
        return await interaction.editReply(metadata.i18n[`${metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].notInVoiceChannel);
    };

    const player = await ctx.PoruManager.fetchPlayer(interaction.guildId, interaction.channel.id, interaction.member.voice.channel.id);
    if (!player) {
        return await interaction.editReply(metadata.i18n[`${metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].notInVoiceChannel);
    };

    const song = player.currentTrack;

    if (!song || !song.info) {
        return await interaction.editReply(metadata.i18n[`${metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].notPlaying);
    } else {
        let currentFormattedDuration = TimeFormat.formatLength(song.info.length / 1000);

        let queueTracksText = player.queue.slice(0, 10).map((track, index) => {
            return `${index + 1}. [**${track.info.title.slice(0, 32) + (track.info?.title.length > 32 ? ".." : "" )}**](${track.info?.uri}) (**${TimeFormat.formatLength(track.info.length / 1000)}**, <@${track.info?.requester.id}>)`
        });

        const queueTemplate = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({ name: metadata.i18n[`${metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].queue.author.replace("%s", interaction.guild?.name.slice(0, 27) + (interaction.guild?.name.length > 28 ? ".." : "" )), iconURL: interaction.guild?.iconURL({ size: 4096, dynamic: true }) })
        .setTitle(metadata.i18n[`${metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].queue.title)
        .addFields([
            {
                name: "Songs in queue",
                value: "`" + (player.queue.length + 1 ) + "`",
                inline: true
            },
            {
                name: "Loop mode",
                value: player.loop == "NONE" ? "`Disabled`" : (player.loop == "TRACK" ? "`Track`" : "`Queue`"),
                inline: true
            }
        ])
        .setThumbnail(interaction.guild?.iconURL({ size: 4096, dynamic: true }))
        .setDescription(`Now playing: [**${song.info.title.slice(0, 32) + (song.info?.title.length > 32 ? ".." : "" )}**](${song.info?.uri}) (**${currentFormattedDuration}**, <@${song.info?.requester.id}>) \n\n` + queueTracksText.join("\n"))
        .setFooter({ text: `Current song requested by ${song.info.requester.tag}`, iconURL: song.info.requester.displayAvatarURL({ size: 4096, dynamic: true }), })
        .setTimestamp();
        
        await interaction.editReply({
            embeds: [queueTemplate]
        });
    };
};

export { metadata, execute };