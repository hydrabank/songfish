import chalk from "chalk";
import { ActionRowBuilder } from "discord.js";
import { metadata as accessApplicationButton } from "../interactions/buttons/applicationBegin";
import { meta as manifest } from "../../config.js";

const evt = {
    name: 'interactionCreate',
    exec: async (ctx, interaction) => {
        let key = "commandName";
        try {
            if (interaction.isChatInputCommand()) {
                const applicationStatus = await ctx.DatabaseManagers.main.get(`${interaction.guild?.id}:accessStatus`);
                
                if (interaction.commandName !== "swissknife") {
                    if ((!applicationStatus) || (typeof applicationStatus === "object" && applicationStatus.status !== "approved")) {
                        return await interaction.reply({ content: `This guild does not have access to ${manifest.displayName}. If you have \`Manage Server\` permissions, you may click the button below to apply for access.`, ephemeral: true, components: [
                            new ActionRowBuilder().addComponents(
                                accessApplicationButton.builder.setCustomId("applicationBegin")
                            )
                        ] });
                    };
                };

                key = "commandName";
                const cmd = ctx.CommandManager.getCommand(interaction.commandName);
                if (cmd.type && cmd.type !== "CommandInteraction") return;
                if (cmd.metadata.proctorOnly) {
                    if (!ctx.config.proctors.includes(interaction?.user?.id)) {
                        return interaction.reply({ content: "You do not have permission to use this command.", ephemeral: false });
                    }
                };
                await cmd.execute(ctx, interaction);
            } else if (interaction.isButton()) {
                key = "customId";
                const btn = ctx.CommandManager.getCommand(interaction.customId);
                if (btn.type && btn.type !== "ButtonInteraction") return;
                await btn.execute(ctx, interaction);
            } else if (interaction.isModalSubmit()) {
                key = "customId";
                const modal = ctx.CommandManager.getCommand(interaction.customId);
                if (modal.type && modal.type !== "ModalInteraction") return;
                await modal.execute(ctx, interaction);
            };
        } catch (e) {
            ctx.LogManager.log(`An error occurred whilst running a command ${chalk.bold(interaction[key])}: ${e.stack ? e.stack : e}`, "error", "Fish SDK");
        };
    }
};

export { evt };