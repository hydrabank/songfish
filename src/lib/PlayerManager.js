class PlayerManager {
    constructor(client) {
        this.client = client;
    };
    /**
     * Fetch a player. If one doesn't exist, create it.
     * @param {object} client The Discord.js client instance 
     * @param {object} interaction The interaction data 
     * @returns {object} The player
     */
    async fetch(interaction) {
        const client = this.client;
        let player;
        if (interaction.guild.me.voice.channelId === null || interaction.guild.me.voice.channelId === undefined || (await client.lavalink.getPlayer(interaction.guild.id)) === null) {
            player = await client.lavalink.createPlayer(interaction.guild.id);
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
                channel.send(`The song **${track.title}** is not available to play back for various reasons (like age restriction). Apologies for the inconveniences.`).catch(_ => {
                    null;
                });
            });

        } else {
            player = await client.lavalink.getPlayer(interaction.guild.id);
        };

        return player;
    };
};

module.exports = PlayerManager;