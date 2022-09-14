import { CommandInteraction } from "discord.js";

let f_commandOption = {
    type: "object",
    properties: {
        name: { type: "string", describe: "The name of the option (visible in front-end and used in backend as a variable)" },
        description: { type: "string", describe: "The description of the option that will be shown to the user" },
        type: { type: "string", describe: "The type of the option (string, integer, boolean, user, channel, role, mentionable, subcommand, subcommandgroup)" },
        required: { type: "boolean", describe: "Whether the option is required or not" },
        choices: { type: "array", describe: "The choices of the option (only for string and integer types)" },
        options: { type: "array", describe: "The sub-options of the option (only for subcommand (f_subCommand) and subcommandgroup types)" },
    }
};

let f_subCommand = {
    type: "object",
    properties: {
        name: { type: 'string', describe: 'The name of the subcommand' },
        describe: { type: 'string', describe: 'The description of the subcommand' },
        options: {
            type: 'array',
            describe: 'The options of the subcommand',
            items: f_commandOption
        }
    }
};

const schema = {
    id: 'SlashCommand',
    type: 'object',
    properties: {
        name: { type: 'string', describe: 'The name of the command' },
        type: { type: CommandInteraction, describe: 'The type of the interaction; in this case, it would be a CommandInteraction' },
        options: {
            type: 'array',
            describe: 'The options of the command',
            items: f_commandOption
        },
        subCommands: {
            type: 'array',
            describe: 'The subcommands of the command',
            items: {
                type: 'object',
                properties: f_subCommand
            }
        }
    }
};

export default schema;