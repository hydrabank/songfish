const { SlashCommandBuilder } = require("@discordjs/builders");
const { LocalizationManager } = require('../lib/StringManagers');

module.exports = {
    metadata: new SlashCommandBuilder()
        .setName("invitemanager")
        .setDescription("[PROCTOR ONLY] Manage Songfish's authorised servers.")
        .addStringOption(o =>
            o.setName("operation")
                .setDescription("Select an operation")
                .setRequired(true)
                .addChoices(
                    { name: "Remove", value: "remove" },
                    { name: "Add", value: "add" }
                ))
        .addStringOption(o =>
            o.setName("guild")
                .setDescription("The ID of the guild to add or remove from the list of authorized guilds")
                .setRequired(true)),
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });
        if (!client.config.proctors.includes(interaction.member.id)) return interaction.editReply(LocalizationManager.localizeString("general", "noPermission", interaction.locale));
        const operation = interaction.options.getString("operation");
        const guild = interaction.options.getString("guild");

        if (operation === "add") {
            await client.db.set(`${guild}.authorized`, true);
            return interaction.editReply(`The guild ID \`${guild}\` was added to the authorized database.`);
        } if (operation === "remove") {
            await client.db.delete(`${guild}.authorized`);
            return interaction.editReply(`The guild ID \`${guild}\` was removed from the authorized database.`);
        };
    }
};