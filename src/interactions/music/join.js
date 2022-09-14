import { ActionRowBuilder, CommandInteraction, SlashCommandBuilder } from "discord.js";

const metadata = {
    name: "join",
    type: "CommandInteraction",
    proctorOnly: false,
    dmCommand: false,
    builder: new SlashCommandBuilder()
        .setDescription("Requests Songfish to join the current user's voice channel."),
    i18n: {
        "default": {
            voiceChannelRequired: "🤔 You must be in a voice channel to invite me to join you!",
            joinedVoiceChannel: "🎙 Successfully connected to (%s)",
            alreadyInChannel: "😔 I'm already in a voice channel (%s). Please disconnect me from that channel before inviting me to another one, or move me to the channel you want me to join.",
            alreadyInThisChannel: "I'm already in **your** voice channel (%s). Start playing music!"
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
        } if (interaction.guild?.members?.me?.voice.channel && interaction.guild?.members?.me?.voice.channel.id === interaction.member?.voice?.channel?.id) {
            return await interaction.editReply(metadata.i18n[`${metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].alreadyInThisChannel.replace("%s", interaction.guild?.members?.me?.voice?.channel));
        };

        let player = await ctx.PoruManager.fetchPlayer(interaction.guildId, interaction.channel.id, interaction.member.voice.channel.id);
        if (!player.isConnected) {
            await player.reconnect();
        };

        await interaction.editReply(metadata.i18n[`${metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].joinedVoiceChannel.replace("%s", interaction.member?.voice?.channel));
    };
};

export { metadata, execute };