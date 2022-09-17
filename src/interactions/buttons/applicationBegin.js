import { ButtonBuilder, ButtonStyle, PermissionsBitField, time } from "discord.js";
import { metadata as accessApplicationModal } from "../modals/accessApplicationModal";
import { meta as manifest } from "../../../config.js";

const metadata = {
    name: "applicationBegin",
    type: "ButtonInteraction",
    builder: new ButtonBuilder()
        .setLabel("Begin application")
        .setEmoji("📋")
        .setStyle(ButtonStyle.Primary),
    i18n: {

    }
};

async function execute(ctx, interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return await interaction.reply({ content: "You do not have permission to use this button! In order to register, you must have `Manage Server` permissions.", ephemeral: true });
    
    const applicationStatus = await ctx.DatabaseManagers.main.get(`${interaction.guild?.id}:accessStatus`);
    if (applicationStatus && applicationStatus.status === "approved") return await interaction.reply({ content: `${manifest.displayName} access is currently active for this server. Have fun!`, ephemeral: true });
    
    return await interaction.showModal(accessApplicationModal.builder);
};

export { metadata, execute };