import { CommandInteraction, Embed, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import TimeFormat from "../../lib/TimeFormat";
import { SlashCommand } from "../../schema/schemas";

const metadata = {
    name: "clear",
    type: "CommandInteraction",
    proctorOnly: false,
    dmCommand: false,
    builder: new SlashCommandBuilder()
        .setDescription("Clear all songs in the queue"),
    i18n: {
        "default": {
            voiceChannelRequired: "🤔 You must be in my voice channel to remove me from it!",
            notInVoiceChannel: "🤔 I'm not in a voice channel!",
            notPlaying: "🚫 I'm not playing anything right now",
            clear: "🚮 Cleared the queue"
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
        if (!player) {
            return await interaction.editReply(metadata.i18n[`${metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].notInVoiceChannel);
        };

        const song = player.currentTrack;

        if (!song) {
            return await interaction.editReply(metadata.i18n[`${metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].notPlaying);
        } else {
            await player.queue.clear();
            await interaction.editReply(metadata.i18n[`${metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].clear);
        }
    };
};

export { metadata, execute };