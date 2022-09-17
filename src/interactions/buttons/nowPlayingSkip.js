import { ButtonBuilder, EmbedBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import TimeFormat from "../../lib/TimeFormat";
import nowPlaying from "../../lib/nowPlaying.i18n.config.js";
import { metadata as nowPlayingPause } from "../buttons/nowPlayingPause";
import { metadata as nowPlayingResume } from "../buttons/nowPlayingResume";
import { metadata as nowPlayingSkip } from "../buttons/nowPlayingSkip";
import { metadata as nowPlayingLeave } from "../buttons/nowPlayingLeave";

const metadata = {
    name: "nowPlayingSkip",
    type: "ButtonInteraction",
    proctorOnly: false,
    dmCommand: false,
    builder: new ButtonBuilder()
        .setLabel("Skip")
        .setEmoji("⏭️")
        .setStyle(ButtonStyle.Primary),
    i18n: {
        "default": {
            voiceChannelRequired: "🤔 You must be in my voice channel to remove me from it!",
            notInVoiceChannel: "🤔 I'm not in a voice channel!",
            notPlaying: "🚫 I'm not playing anything right now",
            skipped: "⏭ Skipped the current song"
        }
    }
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
        let song = player.queue.first();
        if (!player) {
            return await interaction.editReply(metadata.i18n[`${metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].notInVoiceChannel);
        };

        if (player.currentTrack) {
            if (player.queue.size === 0) {
                player.stop();
                return await interaction.editReply(metadata.i18n[`${metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].skipped);
            };
            await player.stop();
        };

        if (!player.currentTrack?.info && player.queue.size <= 0) {
            return await interaction.editReply(metadata.i18n[`${metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].notPlaying);
        } else {
            let formattedDuration = TimeFormat.formatLength(song.info.length / 1000);
            let formattedPosition = TimeFormat.formatLength(player.position / 1000);

            const npEmbed = new EmbedBuilder()
                .setColor("Random")
                .setAuthor({ name: nowPlaying.metadata.i18n[`${nowPlaying.metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].nowPlaying.author, iconURL: interaction.guild?.iconURL({ size: 4096, dynamic: true }) })
                .setTitle(nowPlaying.metadata.i18n[`${nowPlaying.metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].nowPlaying.title.replace("%s", song.info.title))
                .setURL(song.info.uri)
                .setImage(song.info.image)
                .addFields(
                    { name: "Duration", value: `**${formattedPosition}** of **${formattedDuration}**`, inline: true },
                    { name: "Requested by", value: `<@${song.info.requester.id}>`, inline: true }
                )
                .setFooter({ text: `Requested by ${song.info.requester.tag}`, iconURL: song.info.requester.displayAvatarURL({ size: 4096, dynamic: true }), url: song.info.uri })
                .setTimestamp();

            const original = interaction.message;
            await original.delete();
            const reply = await interaction.fetchReply();
            await reply.edit({
                embeds: [npEmbed],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            nowPlayingPause.builder.setCustomId(nowPlayingPause.name).setDisabled(false),
                            nowPlayingSkip.builder.setCustomId("nowPlayingSkip").setDisabled(false),
                            nowPlayingLeave.builder.setCustomId("nowPlayingLeave").setDisabled(false)
                        )
                ]
            });
    
            await interaction.editReply(metadata.i18n[`${metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].skipped);
        };
    };
};

export { metadata, execute };