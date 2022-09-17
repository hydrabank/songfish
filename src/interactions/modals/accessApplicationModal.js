import { ActionRowBuilder, time, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { metadata as applicationAccept } from "../buttons/applicationAccept";
import { metadata as applicationDeny } from "../buttons/applicationDeny";
import { meta as manifest } from "../../../config.js";

let components = {
    first: new ActionRowBuilder().addComponents(
        new TextInputBuilder()
            .setCustomId("accessReason")
            .setLabel(`Why do you want to use ${manifest.displayName}?`)
            .setPlaceholder("Enter your reason here")
            .setStyle(TextInputStyle.Paragraph)
            .setMinLength(50)
            .setMaxLength(1000)
            .setRequired(true)
    ),
    second: new ActionRowBuilder().addComponents(
        new TextInputBuilder()
            .setCustomId("accessOften")
            .setLabel("Do you often use Discord music bots?")
            .setPlaceholder("One-character answer (Y/n)")
            .setMinLength(1)
            .setMaxLength(1)
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
    )
};

const metadata = {
    name: "accessApplicationModal",
    type: "ModalInteraction",
    builder: new ModalBuilder()
        .setCustomId("accessApplicationModal")
        .setTitle("Apply for access")
        .addComponents(components.first, components.second),
    i18n: {

    }
};

async function execute(ctx, interaction) {
    await interaction.deferReply({ ephemeral: true });
    
    const applicationStatus = await ctx.DatabaseManagers.main.get(`${interaction.guild?.id}:accessStatus`);
    if (!applicationStatus || applicationStatus.status === "denied") {
        const reason = interaction.fields.getTextInputValue("accessReason");
        const often = interaction.fields.getTextInputValue("accessOften");

        const embed = new EmbedBuilder()
            .setAuthor({ name: `Application submitted by ${interaction.user?.tag}`, iconURL: interaction.user?.displayAvatarURL({ size: 4096, dynamic: true }) })
            .setTitle(`Access Application: ${interaction.guild?.name.slice(0, 27) + (interaction.guild?.name.length > 28 ? ".." : "" )}`)
            .addFields(
                { name: "Why did they apply?", value: "```md\n" + reason + "\n```", inline: false },
                { name: "Does the server use music bots often?", value: `**${often}**`, inline: false }
            )
            .setTimestamp()
            .setColor("Green")
            .setFooter({ text: ctx.client.user?.username, iconURL: ctx.client.user?.displayAvatarURL({ size: 4096, dynamic: true }) });

        const guild = await ctx.client.guilds.fetch(ctx.config.discord.applicationGuild.id);
        const channel = await guild.channels.cache.get(ctx.config.discord.applicationGuild.channelID);

        await channel.send({ embeds: [embed], components: [
            new ActionRowBuilder().addComponents(
                applicationAccept.builder.setCustomId("applicationAccept"),
                applicationDeny.builder.setCustomId("applicationDeny")
            )
        ], content: `<@&${ctx.config.discord.applicationGuild.roleID}>` }).then(async (c) => {
            await ctx.DatabaseManagers.main.set(`${interaction.guild?.id}:accessStatus`, { status: "pending", timestamp: time(Date.now()), requester: {
                tag: interaction.user?.tag,
                id: interaction.user?.id
            } });

            await ctx.DatabaseManagers.main.set(`msg:${c.id}:application`, { guildId: interaction.guild?.id, guildName: interaction.guild?.name });

            await interaction.editReply("Your application has been submitted!");
        }).catch(async () => {
            await interaction.editReply("An error occurred while submitting your application. Please try again later.");
        });
    } else if (applicationStatus.status === "pending") {
        let timestamp = applicationStatus.timestamp;
        let user = applicationStatus.requester;
        await interaction.editReply(`**${user.tag}** already submitted an application **${timestamp}**. Please wait until it is reviewed.`);
    } else if (applicationStatus.status === "approved") {
        let timestamp = applicationStatus.timestamp;
        let user = applicationStatus.requester;
        await interaction.editReply(`An application submitted by **${user.tag}** was approved **${timestamp}**. Enjoy your access to ${manifest.displayName}!`);
    };
};

export { metadata, execute };