import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../schema/schemas";
import TimeFormat from "../../lib/TimeFormat";

const metadata = {
    name: "play",
    type: "CommandInteraction",
    proctorOnly: false,
    dmCommand: false,
    builder: new SlashCommandBuilder()
        .setDescription("Add a song to the Songfish incumbent queue of tracks.")
        .addStringOption(option => 
            option.setName("query")
                .setDescription("The query term for the audio to play (YouTube, Spotify, or remote file; search term or URL)")
                .setRequired(true)
        ),
    i18n: {
        "default": {
            notInMyVoiceChannel: "🤔 You must be in my voice channel to use this command!",
            voiceChannelRequired: "🤔 You must be in a voice channel to use this command!",
            noMatches: "🚫 No matches were found for your query",
            loadFailed: "🚫 Failed to load results for your query",
            playlistQueued: "🎶 Queued playlist **%s** (**`%a`** tracks)",
            songQueued: "🎶 Queued tracks **%s** (**%t**)"
        }
    }
};

async function execute(ctx, interaction) {
    await interaction.deferReply();
    if (!interaction.member?.voice?.channel && !interaction.guild?.members?.voice?.channel) {
        return await interaction.editReply(metadata.i18n[`${metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].voiceChannelRequired);
    };
    const query = interaction.options.getString("query");
    const player = await ctx.PoruManager.fetchPlayer(interaction.guildId, interaction.channel.id, interaction.member.voice?.channel?.id);
    const res = await ctx.PoruManager.poruInstance.resolve(query);

    if (res.loadType === "LOAD_FAILED") {
        return await interaction.editReply(metadata.i18n[`${metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].loadFailed);
    } else if (res.loadType === "NO_MATCHES") {
        return await interaction.editReply(metadata.i18n[`${metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].noMatches);
    };

    if (res.loadType === "PLAYLIST_LOADED") {
        for (const track of res.tracks) {
          track.info.requester = interaction.user;
          await player.queue.add(track);
        };

        if (!player.isPlaying && !player.isPaused) player.play();
    
        await interaction.editReply(metadata.i18n[`${metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].playlistQueued.replace("%s", res.playlistInfo.name).replace("%a", res.tracks.length));
      } else {
        const track = res.tracks[0];
        track.info.requester = interaction.user;

        let formattedDuration = TimeFormat.formatLength(track.info.length / 1000);

        await player.queue.add(track);
        if (!player.isPlaying && !player.isPaused) player.play();

        await interaction.editReply(metadata.i18n[`${metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].songQueued.replace("%s", track.info.title).replace("%t", track.info.isStream ? "LIVE" : formattedDuration));
    };
};

export { metadata, execute };