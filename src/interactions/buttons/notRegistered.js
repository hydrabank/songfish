import { ButtonBuilder, ButtonStyle } from "discord.js";
import { metadata as accessApplicationModal } from "../modals/accessApplicationModal";

const metadata = {
    name: "notRegistered",
    type: "ButtonInteraction",
    builder: new ButtonBuilder()
        .setLabel("Apply for access")
        .setEmoji("📋")
        .setStyle(ButtonStyle.Secondary),
    i18n: {

    }
};

async function execute(ctx, interaction) {
    await interaction.showModal(accessApplicationModal.builder);
};

export { metadata, execute };