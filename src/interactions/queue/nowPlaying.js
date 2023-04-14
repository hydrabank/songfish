import { ActionRowBuilder, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import TimeFormat from "../../lib/TimeFormat";
import nowPlaying from "../../lib/nowPlaying.i18n.config.js";
import { SlashCommand } from "../../schema/schemas";

import { metadata as nowPlayingPause } from "../buttons/nowPlayingPause";
import { metadata as nowPlayingResume } from "../buttons/nowPlayingResume";
import { metadata as nowPlayingSkip } from "../buttons/nowPlayingSkip";
import { metadata as nowPlayingLeave } from "../buttons/nowPlayingLeave";

const metadata = {
    name: "nowplaying",
    type: "CommandInteraction",
    proctorOnly: false,
    dmCommand: false,
    builder: new SlashCommandBuilder()
        .setDescription("Get information about the currently-playing track."),
    i18n: nowPlaying.metadata.i18n
};

async function execute(ctx, interaction) {
    await interaction.deferReply();
    if (!interaction.member?.voice?.channel && !interaction.guild?.members?.voice?.channel) {
        return await interaction.editReply(metadata.i18n[`${metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].voiceChannelRequired);
    } else {
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
            let formattedDuration = TimeFormat.formatLength(song.info.length / 1000);
            let formattedPosition = TimeFormat.formatLength(player.position / 1000);

            const nowPlaying = new EmbedBuilder()
                .setColor("Random")
                .setAuthor({ name: metadata.i18n[`${metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].nowPlaying.author, iconURL: interaction.guild?.iconURL({ size: 4096, dynamic: true }) })
                .setTitle(metadata.i18n[`${metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].nowPlaying.title.replace("%s", song.info.title))
                .setURL(song.info.uri)
                .setImage(song.info.image)
                .addFields(
                    { name: "Duration", value: `**${formattedPosition}** of **${formattedDuration}**`, inline: true },
                    { name: "Requested by", value: `<@${song.info.requester.id}>`, inline: true }
                )
                .setFooter({ text: `Requested by ${song.info.requester.tag}`, iconURL: song.info.requester.displayAvatarURL({ size: 4096, dynamic: true }), url: song.info.uri })
                .setTimestamp();
            
            await interaction.editReply({
                embeds: [
                    nowPlaying
                ],
                components: [
                    new ActionRowBuilder().addComponents(
                        player.isPlaying ? nowPlayingPause.builder.setCustomId(nowPlayingPause.name).setDisabled(false) : nowPlayingResume.builder.setCustomId(nowPlayingResume.name).setDisabled(false),
                        nowPlayingSkip.builder.setCustomId("nowPlayingSkip").setDisabled(false),
                        nowPlayingLeave.builder.setCustomId("nowPlayingLeave").setDisabled(false)
                    )
                ]
            });
        };
    };
};

export { metadata, execute };