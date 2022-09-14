import chalk from "chalk";

const evt = {
    name: 'interactionCreate',
    exec: async (ctx, interaction) => {
        let key = "commandName";
        try {
            if (interaction.isChatInputCommand()) {
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