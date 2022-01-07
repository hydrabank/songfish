/**
 * Manage Lavalink player connections and the cluster in general
 * @param {object} client The Discord.js client instance
 */
class PlayerManager {
    /**
     * Manage Lavalink player connections and the cluster in general
     * @param {object} client The Discord.js client instance
     */
    constructor(client) {
        this.client = client;
    };
    /**
     * Fetch a player. If one doesn't exist, create it.
     * @param {object} interaction The interaction data 
     * @returns {object} The player
     */
    async fetch(interaction) {
        const client = this.client;
        let player;
        if (interaction.guild.me.voice.channelId === null || interaction.guild.me.voice.channelId === undefined || (await client.lavalink.getPlayer(interaction.guild.id)) === null) {
            player = await client.lavalink.createPlayer(interaction.guild.id);
            player.errorExceptions = {
                count: 0,
                timestamp: Date.now()
            };
            player.on("channelMove", async function (oldChannel, newChannel) {
                const channel = interaction.guild.channels.cache.get(newChannel);
                const me = await interaction.guild.members.fetch(client.user.id);

                if (channel.type === "GUILD_STAGE_VOICE" && me.voice.suppress) await interaction.guild.me.voice.setSuppressed(false).catch(e => {
                    player.disconnect();
                });

                await require("util").promisify(setTimeout)(1000);

                await player.pause();

                await require("util").promisify(setTimeout)(1000);

                await player.resume();
            });

            player.on("trackException", async function (str) {
                let err;
                const track = await client.lavalink.rest.decodeTrack(str).catch(f => {
                    err = true;
                });
                if (err == true) return;

                const channel = interaction.guild.channels.cache.get(interaction.channel.id);
                player.errorExceptions.count++;
                player.errorExceptions.timestamp = Date.now();
                if (player.errorExceptions.count >= 15 && ((Date.now() - player.errorExceptions.timestamp) <= 900000)) {
                    channel.send("**Too many errors have occurred in the past 15 minutes. The bot will now disconnect from the channel.**").catch(f => {
                        null;
                    });
                    player.destroy();
                    return player.disconnect();
                }
                
                channel.send(`The song **${track.title}** is not available to play back for various reasons (like age restriction). Apologies for the inconveniences.`).catch(_ => {
                    null;
                });
            });

            player.on("channelLeave", async function (c, reason, remote) {
                await player.destroy();
            });

        } else {
            player = await client.lavalink.getPlayer(interaction.guild.id);
        };

        return player;
    };
};

/**
 * Manage YouTube metadata, information, and statistics
 * @param {object} client The Discord.js client instance 
 */
class YouTubeManager {
    /**
     * Manage YouTube metadata, information, and statistics
     * @param {object} client The Discord.js client instance 
     */
    constructor(client) {
        this.client = client;
    };

    /**
     * Fetch the YouTube thumbnail for a given video
     * @param {string} videoURI The YouTube video URI 
     */
    getThumbnail(videoURI) {
        // This class method was inspired by Mohamad Hamouday's answer to a question on Stack Overflow
        // Link: https://stackoverflow.com/a/65431128 
        // The code was modified to provide all sizes of video thumbnails

        if (typeof videoURI !== "string") {
            throw new TypeError(`type of videoURI expected to be string; actual type provided was ${typeof videoURI}`);
        };

        let id, thumbnail, result;

        if (result = videoURI.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/)) {
            id = result.pop();
        } else if (result = videoURI.match(/youtu.be\/(.{11})/)) {
            id = result.pop();
        };

        if (id) {
            thumbnail = {
                small: `https://i.ytimg.com/vi/${id}/default.jpg`,
                medium: `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
                large: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
                maximum: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`
            };
        } else {
            thumbnail = null;
        };

        return thumbnail;
    };
};

module.exports = { PlayerManager, YouTubeManager };