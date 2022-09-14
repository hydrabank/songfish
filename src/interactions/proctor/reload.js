import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../schema/schemas";
import chalk from "chalk";

const metadata = {
    name: "reload",
    type: "CommandInteraction",
    proctorOnly: true,
    dmCommand: true,
    builder: new SlashCommandBuilder()
        .setDescription("Reloads the bot's commands.")
        .addBooleanOption(option => option.setName("register").setDescription("Register new commands to Discord?"))
};

async function execute(ctx, interaction) {
    await interaction.deferReply();
    const register = interaction.options.getBoolean("register");
    if (register) {
        ctx.LogManager.log(`Reloading commands (Discord re-registration: ${chalk.bold["red"]("true")})`, "load", "CommandManagerBridge");
        await ctx.CommandManager.loadCommands(ctx, true);
        ctx.LogManager.log(`Reloaded ${chalk.bold(ctx.CommandManager.commands.size)} commands`, "load", "CommandManagerBridge");
        return await interaction.editReply(`Reloaded and re-registered **${ctx.CommandManager.commands.size}** commands successfully.`);
    } else {
        ctx.LogManager.log(`Reloading commands (Discord re-registration: ${chalk.bold["green"]("false")})`, "load", "CommandManagerBridge");
        await ctx.CommandManager.loadCommands(ctx, false);
        ctx.LogManager.log(`Reloaded ${chalk.bold(ctx.CommandManager.commands.size)} commands`, "load", "CommandManagerBridge");
        return await interaction.editReply(`Reloaded **${ctx.CommandManager.commands.size}** commands successfully.`);
    };
};

export { metadata, execute };