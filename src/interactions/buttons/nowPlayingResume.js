import { ButtonBuilder, EmbedBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import TimeFormat from "../../lib/TimeFormat";
import nowPlaying from "../../lib/nowPlaying.i18n.config.js";
import { metadata as nowPlayingPause } from "../buttons/nowPlayingPause";
import { metadata as nowPlayingResume } from "../buttons/nowPlayingResume";
import { metadata as nowPlayingSkip } from "../buttons/nowPlayingSkip";
import { metadata as nowPlayingLeave } from "../buttons/nowPlayingLeave";

const metadata = {
    name: "nowPlayingResume",
    type: "ButtonInteraction",
    builder: new ButtonBuilder()
        .setLabel("Play")
        .setEmoji("▶")
        .setStyle(ButtonStyle.Primary),
    i18n: {
        "default": {
            voiceChannelRequired: "🤔 You must be in a voice channel to use this command.",
            resumedSuccessfully: "🎙️ Resumed the currently playing song",
            alreadyPlaying: "🤔 The song is already playing!",
            notPlaying: "🚫 I'm not playing anything right now",
            alreadyInChannel: "😔 I'm already in another voice channel (%s).",
        }
    }
};

async function execute(ctx, interaction) {
    await interaction.deferReply();
    if (!interaction.member?.voice?.channel && !interaction.guild?.members?.voice?.channel) {
        return await interaction.editReply(metadata.i18n[`${metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].voiceChannelRequired);
    } else {
        if (interaction.guild?.members?.me?.voice.channel && interaction.guild?.members?.me?.voice.channel.id !== interaction.member?.voice?.channel?.id) {
            await ctx.PoruManager.fetchPlayer(interaction.guildId, interaction.channel.id, interaction.member.voice.channel.id);
            return await interaction.editReply(metadata.i18n[`${metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].alreadyInChannel.replace("%s", interaction.guild?.members?.me?.voice?.channel));
        };

        let player = await ctx.PoruManager.fetchPlayer(interaction.guildId, interaction.channel.id, interaction.member.voice.channel.id);
        if (!player.isConnected) {
            await player.reconnect();
        };

        if (!player.isPlaying) {
            await player.pause(false);
        } else {
            return await interaction.editReply(metadata.i18n[`${metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].alreadyPlaying);
        };

        let song = player.currentTrack;

        let formattedDuration = TimeFormat.formatLength(song.info?.length / 1000);
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
                        player.isPlaying ? nowPlayingPause.builder.setCustomId(nowPlayingPause.name).setDisabled(false) : nowPlayingResume.builder.setCustomId(nowPlayingResume.name).setDisabled(false),
                        nowPlayingSkip.builder.setCustomId("nowPlayingSkip").setDisabled(false),
                        nowPlayingLeave.builder.setCustomId("nowPlayingLeave").setDisabled(false)
                    )
            ]
        });

        await interaction.editReply(metadata.i18n[`${metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].resumedSuccessfully.replace("%s", interaction.member?.voice?.channel));
    };
};

export { metadata, execute };