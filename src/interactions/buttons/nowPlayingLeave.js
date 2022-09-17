import { ButtonBuilder, ButtonStyle } from "discord.js";

const metadata = {
    name: "nowPlayingLeave",
    type: "ButtonInteraction",
    builder: new ButtonBuilder()
        .setLabel("Leave")
        .setEmoji("🚪")
        .setStyle(ButtonStyle.Danger),
    i18n: {
        "default": {
            voiceChannelRequired: "🤔 You must be in my voice channel to remove me from it!",
            notInVoiceChannel: "🤔 I'm not in a voice channel!",
            alreadyInChannel: "😔 I'm already in a voice channel (%s). Please disconnect me from that channel before inviting me to another one, or move me to the channel you want me to join.",
            leftVoiceChannel: "🚪 Left this voice channel (%s)"
        }
    }
};

async function execute(ctx, interaction) {
    await interaction.deferReply();
    if (!interaction.member?.voice?.channel && !interaction.guild?.members?.voice?.channel) {
        return await interaction.editReply(metadata.i18n[`${metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].voiceChannelRequired);
    } else {
        if (interaction.guild?.members?.me?.voice.channel && interaction.guild?.members?.me?.voice.channel.id !== interaction.member?.voice?.channel?.id) {
            return await interaction.editReply(metadata.i18n[`${metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].alreadyInChannel.replace("%s", interaction.guild?.members?.me?.voice?.channel));
        };
        if (!interaction.guild?.members?.me?.voice.channel) {
            return await interaction.editReply(metadata.i18n[`${metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].notInVoiceChannel);
        };
        await ctx.PoruManager.deletePlayer(interaction.guildId, interaction.channel.id, interaction.member.voice.channel.id);
        await interaction.guild?.members?.me?.voice?.disconnect();

        const original = interaction.message;
        await original.delete();

        await interaction.editReply(metadata.i18n[`${metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].leftVoiceChannel.replace("%s", interaction.member?.voice?.channel));
    };
};

export { metadata, execute };