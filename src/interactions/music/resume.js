import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../schema/schemas";

const metadata = {
    name: "resume",
    type: "CommandInteraction",
    proctorOnly: false,
    dmCommand: false,
    builder: new SlashCommandBuilder()
        .setDescription("Resume the currently playing track."),
    i18n: {
        "default": {
            voiceChannelRequired: "🤔 You must be in a voice channel to use this command.",
            resumedSuccessfully: "🎙️ Resumed the currently playing track",
            alreadyPlaying: "🤔 The track is already playing!",
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

        await interaction.editReply(metadata.i18n[`${metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].resumedSuccessfully.replace("%s", interaction.member?.voice?.channel));
    };
};

export { metadata, execute };