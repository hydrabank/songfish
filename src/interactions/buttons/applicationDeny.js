import { ButtonBuilder, ButtonStyle, time } from "discord.js";
import { metadata as accessApplicationModal } from "../modals/accessApplicationModal";

const metadata = {
    name: "applicationDeny",
    type: "ButtonInteraction",
    builder: new ButtonBuilder()
        .setLabel("Deny application")
        .setEmoji("❌")
        .setStyle(ButtonStyle.Danger),
    i18n: {

    }
};

async function execute(ctx, interaction) {
    await interaction.deferReply();
    if (!ctx.config.proctors.includes(interaction.user?.id)) return interaction.editReply({ content: "You do not have permission to use this command.", ephemeral: true });

    const applicationStatus = await ctx.DatabaseManagers.main.get(`msg:${interaction.message?.id}:application`);
    if (!applicationStatus) return await interaction.editReply({ content: "This application is not recorded in the database.", ephemeral: true });
    else {
        const guildStatus = await ctx.DatabaseManagers.main.get(`${applicationStatus.guildId}:accessStatus`);
        if (guildStatus.status !== "pending") return await interaction.editReply({ content: "This application is not pending. Either manually add or remove application status using the Swiss Knife.", ephemeral: true });
        guildStatus.status = "denied";
        guildStatus.timestamp = time(Date.now());
        
        await ctx.DatabaseManagers.main.set(`${applicationStatus.guildId}:accessStatus`, guildStatus);
        await ctx.DatabaseManagers.main.delete(`msg:${interaction.message?.id}:application`);
        
        await interaction.message?.delete();

        await interaction.editReply({ content: `${applicationStatus.guildName}'s application was denied.`, ephemeral: true });
    }
};

export { metadata, execute };