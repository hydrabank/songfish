import { time, SlashCommandBuilder, ActivityType } from "discord.js";
import chalk from "chalk";
import { metadata as accessApplicationModal } from "../modals/accessApplicationModal";

const metadata = {
    name: "swissknife",
    type: "CommandInteraction",
    proctorOnly: true,
    dmCommand: true,
    builder: new SlashCommandBuilder()
        .setDescription("The Swiss Knife contains various commands used for managing Songfish's operations.")
        .addSubcommand(subcommand =>
            subcommand.setName("reload")
                .setDescription("Reloads the bot's commands.")
                .addBooleanOption(option => option.setName("register").setDescription("Register new commands to Discord?"))
        ).addSubcommand(subcommand =>
            subcommand.setName("access")
                .setDescription("Manage guild-by-guild access to Songfish.")
                .addStringOption(option => option.setName("guild").setDescription("The guild to manage access for.").setRequired(true))
                .addStringOption(option => option.setName("action").setDescription("The action to perform.").addChoices(
                    { name: "Add", value: "add" },
                    { name: "Remove", value: "remove" },
                ).setRequired(true))
        ).addSubcommand(subcommand =>
            subcommand.setName("status")
                .setDescription("Set the bot's status.")
                    .addStringOption(option => option.setName("status").setDescription("The status to set.").setRequired(true))
                    .addNumberOption(option => option.setName("type").setDescription("The type of status to set.").addChoices(
                        { name: "Playing", value: ActivityType.Playing },
                        { name: "Streaming", value: ActivityType.Streaming },
                        { name: "Listening", value: ActivityType.Listening },
                        { name: "Watching", value: ActivityType.Watching },
                        { name: "Competing", value: ActivityType.Competing },
                    ).setRequired(true))
        ).addSubcommand(subcommand =>
            subcommand.setName("ec")
                .setDescription("Trigger emergency codes to perform various actions.")
                    .addStringOption(option => option.setName("code").setDescription("The code to trigger.").setRequired(true))
        ),
    subCommands: {
        "reload": async (ctx, interaction) => {
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
        },
        "access": async (ctx, interaction) => {
            await interaction.deferReply();
            const guild = interaction.options.getString("guild").trim();
            const action = interaction.options.getString("action");
            let guildStatus = await ctx.DatabaseManagers.main.get(`${guild}:accessStatus`);
            if (guildStatus === null) guildStatus = { status: "pending", timestamp: time(Date.now()), requester: {
                tag: interaction.user?.tag,
                id: interaction.user?.id
            }};

            if (action === "add") {
                if (guildStatus === "approved") {
                    return await interaction.editReply("This guild already has access to Songfish.");
                } else {
                    guildStatus.status = "approved";
                    await ctx.DatabaseManagers.main.set(`${guild}:accessStatus`, guildStatus);
                    return await interaction.editReply(`Added access for guild \`${guild}\` successfully.`);
                };
            } else if (action === "remove") {
                if (guildStatus === "pending") {
                    return await interaction.editReply("This guild does not have access to Songfish.");
                } else {
                    await ctx.DatabaseManagers.main.delete(`${guild}:accessStatus`);
                    return await interaction.editReply(`Removed access for guild \`${guild}\` successfully.`);
                };
            } else {
                return await interaction.editReply("Invalid action.");
            };
        },
        status: async (ctx, interaction) => { 
            const status = interaction.options.getString("status");
            const type = interaction.options.getNumber("type");
            await interaction.deferReply();

            ctx.LogManager.log(`Setting status to ${chalk.bold(status)} (${chalk.bold(type)})`, "load", "CommandManagerBridge");
            await ctx.client.user.setActivity(status, { type: type });
            return await interaction.editReply(`Set status to ${status} (${type}) successfully.`);
        },
        ec: async (ctx, interaction) => {
            const code = interaction.options.getString("code");
            
            if (code.startsWith("vaporwave")) {
                await interaction.deferReply();
                if (!interaction.member.voice.channel.id) return await interaction.editReply("You must be in a voice channel to use this code.");
                const player = await ctx.PoruManager.fetchPlayer(interaction.guildId, interaction.channel.id, interaction.member.voice.channel.id);
                if (code.split(":").length === 1) return await interaction.editReply(`The current vaporwave value is set to \`${player.filters.vaporwave}\`.`);
                let value = parseInt(code.split(":")[1].replace(/\D/g, ""));
                if (isNaN(value)) value = 0;
                player.filters?.setVaporwave(value)
                
                return await interaction.editReply(`Set vaporwave effect to \`${value}\` successfully.`);
            } else if (code.startsWith("nightcore")) {
                await interaction.deferReply();
                if (!interaction.member.voice.channel.id) return await interaction.editReply("You must be in a voice channel to use this code.");
                const player = await ctx.PoruManager.fetchPlayer(interaction.guildId, interaction.channel.id, interaction.member.voice.channel.id);
                if (code.split(":").length === 1) return await interaction.editReply(`Nightcore is currently \`${player.filters.nightcore === true ? "enabled" : "disabled"}\`.`);
                let value = code.split(":")[1];
                if (value !== "true" && value !== "false") value = "false";
                player.filters?.setNightcore(value === "true" ? true : false);
                
                return await interaction.editReply(`Nightcore is now \`${value === "true" ? "enabled" : "disabled"}\`!`);
            } else if (code === "test") {
                await interaction.showModal(accessApplicationModal.builder);
            } else {
                await interaction.deferReply();
                return await interaction.editReply("Invalid code.");
            };
        },
    }
};

async function execute(ctx, interaction) {
    const subCommand = interaction.options.getSubcommand();
    if (metadata.subCommands[subCommand]) {
        return await metadata.subCommands[subCommand](ctx, interaction);
    } else {
        return await interaction.reply("This subcommand is not yet implemented.");
    };
};

export { metadata, execute };