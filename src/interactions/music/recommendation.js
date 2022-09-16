import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../schema/schemas";
import TimeFormat from "../../lib/TimeFormat";

const metadata = {
    name: "recommendation",
    type: "CommandInteraction",
    proctorOnly: false,
    dmCommand: false,
    builder: new SlashCommandBuilder()
        .setDescription("Add a random song from Songfish's recommendations into the queue."),
    i18n: {
        "default": {
            notInMyVoiceChannel: "🤔 You must be in my voice channel to use this command!",
            voiceChannelRequired: "🤔 You must be in a voice channel to use this command!",
            noMatches: "🚫 An error occurred whilst trying to pick a random song. Please try again later.",
            loadFailed: "🚫 An error occurred whilst trying to pick a random song. Please try again later.",
            playlistQueued: "🎶 Queued playlist **%s** (**`%a`** tracks)",
            songQueued: "🎶 I've picked a random recommendation for you - **%s** (**%t**). Take a listen! 😁",
            improperType: "🚫 Your Songfish administrator has incorrectly configured the recommendation playlist. Please contact them to fix this issue."
        }
    }
};

async function execute(ctx, interaction) {
    await interaction.deferReply();
    if (!interaction.member?.voice?.channel && !interaction.guild?.members?.voice?.channel) {
        return await interaction.editReply(metadata.i18n[`${metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].voiceChannelRequired);
    };
    const query = "https://open.spotify.com/playlist/4xeuX9cAUJOpQeJnlDcGCL?si=4542c9f1239b4e3c";
    const player = await ctx.PoruManager.fetchPlayer(interaction.guildId, interaction.channel.id, interaction.member.voice?.channel?.id);
    const res = await ctx.PoruManager.poruInstance.resolve(query);

    if (res.loadType === "LOAD_FAILED") {
        return await interaction.editReply(metadata.i18n[`${metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].loadFailed);
    } else if (res.loadType === "NO_MATCHES") {
        return await interaction.editReply(metadata.i18n[`${metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].noMatches);
    };

    if (res.loadType === "PLAYLIST_LOADED") {
        let track = res.tracks[Math.floor(Math.random() * res.tracks.length)];
        track.info.requester = interaction.user;

        let formattedDuration = TimeFormat.formatLength(track.info.length / 1000);

        await player.queue.add(track);
        if (!player.isPlaying && !player.isPaused) player.play();
    
        await interaction.editReply(metadata.i18n[`${metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].songQueued.replace("%s", track.info.title).replace("%t", track.info.isStream ? "LIVE" : formattedDuration));
      } else {
        await interaction.editReply(metadata.i18n[`${metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].improperType);
    };
};

export { metadata, execute };