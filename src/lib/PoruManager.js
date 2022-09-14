import { Collection } from "discord.js";
import chalk from "chalk";

const { Poru } = require("poru");
export default class PoruManager {
    constructor({ ctx, database }) {
        this.ctx = ctx;
        this.database = database;
        this.poruInstance = new Poru(this.ctx.client, this.ctx?.config?.lavalink?.nodes, {
            reconnectTime: 0,
            resumeKey: `${this.ctx.config?.databases?.namespace}-lavalinkResume`,
            resumeTimeout: 60,
            defaultPlatform: "ytsearch",
        })
        
        this.poruPlayers = new Collection();

        this.poruInstance.on("nodeConnect", (n) => {
            this.ctx.LogManager.log(`Handshake completed and connection established with Lavalink node ${chalk.bold["blue"](`${n.name}`)}.`, "info", "PoruManager");
        });

        this.poruInstance.on("nodeClose", (n) => {
            this.ctx.LogManager.log(`Connection terminated with Lavalink node ${chalk.bold["blue"](`${n.name}`)}.`, "info", "PoruManager");
        });

        this.poruInstance.on("queueEnd", (p) => {
            this.deletePlayer(p.guildId);
        })
    };
    
    async init() {
        try {
            this.poruInstance.init(this.ctx.client);
            this.ctx.LogManager.log("Poru initialization request sent.", "info", "PoruManager");
            return true;
        } catch (e) {
            this.ctx.LogManager.log(`An error occurred whilst initializing Poru: ${e.stack ? e.stack : e}`, "error", "PoruManager");
            return e;
        };
    };
    
    async fetchPlayer(guildId, textChannel, voiceChannel) {
        if (!this.poruPlayers.has(guildId)) {
            this.poruPlayers.set(guildId, await this.poruInstance.createConnection({
                guildId,
                textChannel,
                voiceChannel,
                selfDeaf: true
            }));
        };

        return this.poruPlayers.get(guildId);
    };

    async deletePlayer(guildId) {
        const player = this.poruPlayers.get(guildId);

        if (player) {
            await player.disconnect();
            await player.destroy();
            this.poruPlayers.delete(guildId);
        };
    };
};