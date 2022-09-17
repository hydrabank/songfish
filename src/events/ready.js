import chalk from "chalk";
import { SlashCommandBuilder, ActivityType } from "discord.js";
import { meta as manifest } from "../../config.js";

const evt = {
    name: 'ready',
    exec: async (ctx) => {
        if (ctx.config?.discord?.status?.type && ctx.config?.discord?.status?.content) {
            ctx.client.user.setActivity(ctx.config?.discord?.status?.content, { type: ctx.config?.discord?.status?.type });
        } else {
            ctx.client.user.setActivity("Music! 🎺", { type: ActivityType.Listening });
        };
        await ctx.PoruManager.init();
        ctx.LogManager.log(`${chalk.bold(ctx.client?.user?.tag)} logged in successfully`, "load", "Fish SDK");
        ctx.LogManager.log(`Invite ${manifest.displayName} to your server:`, "load", "Fish SDK");
        ctx.LogManager.log(`${chalk.bold(`https://discord.com/api/oauth2/authorize?client_id=${ctx.config.discord.clientID}&permissions=8&scope=bot%20applications.commands`)}`, "load", "Fish SDK");
    }
};

export { evt };