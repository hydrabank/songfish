import { SlashCommandBuilder } from "discord.js";
import { metadata as accessApplicationModal } from "../modals/accessApplicationModal";

const metadata = {
    name: "componentdebug",
    type: "CommandInteraction",
    proctorOnly: true,
    dmCommand: false,
    builder: new SlashCommandBuilder()
        .setDescription("An example command, usually used for debugging purposes.")
};

async function execute(ctx, interaction) {
    await interaction.showModal(accessApplicationModal.builder);
};

export { metadata, execute };