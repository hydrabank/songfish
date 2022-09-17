import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { Collection } from 'discord.js';

import LogManager from "./LogManager";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";

export default class CommandsManager {
    constructor({ filePath = path.join(__dirname, "../interactions/"), database }) {
        this.filePath = filePath;
        this.database = database;
        this.commands = new Collection();
    };

    getDatabase() {
        return this.database;        
    };

    getCommandMap() {
        return this.commands;
    };

    getCommand(commandName) {
        return this.commands.get(commandName);
    };

    async registerCommands(ctx, commands) {
        const api = new REST({ version: "10" }).setToken(ctx.config.discord.clientToken);
        if (ctx.config.testing === true) api.put(Routes.applicationGuildCommands(ctx.config.discord.clientID, ctx.config.testingServerID), { body: commands });
        else await api.put(Routes.applicationCommands(ctx.config.discord.clientID), { body: commands });
        
        return true;
    }

    loadCommand(commandName, category) {
        const categoryPath = path.join(this.filePath, category);
        try {
            const command = require(path.join(categoryPath, commandName));
            this.commands.set(command.metadata.name, command);
            LogManager.log(`${chalk.green["bold"]("Success")} loading command ${chalk.cyan["bold"](commandName)} from category ${chalk.blue["bold"](category)}`, "load", "CommandManager");
            delete require.cache[require.resolve(path.join(categoryPath, commandName))];
        } catch (e) {
            LogManager.log(`${chalk.red["bold"]("Error")} loading command ${chalk.cyan["bold"](commandName)} from category ${chalk.blue["bold"](category)}`, "error", "CommandManager");
            LogManager.log(e.stack, "error", "CommandManager");
        };
    }
    
    loadCategory(category) {
        const categoryPath = path.join(this.filePath, category);
        const files = fs.readdirSync(categoryPath, { withFileTypes: true });

        LogManager.log(`Loading commands from ${chalk.blue["bold"](category)} (Commands: ${chalk.bold(files.length)})`, "load", "CommandManager");

        for (const file of files) {
            if (file.isDirectory()) return;
            if (!file.name.endsWith(".js")) return;

            this.loadCommand(file.name, category);
        };
    };

    async loadCommands(ctx, registerToDiscord = false) {
        const dirs = fs.readdirSync(this.filePath, { withFileTypes: true });
        let isDone = false;
        for (const dir of dirs) {
            if (dir.isFile()) return;

            if (!dir.isDirectory()) return;
            this.loadCategory(dir.name, registerToDiscord);

            if (dirs.indexOf(dir) === dirs.length - 1) {
                isDone = true;
            }
        };

        if (isDone) {
            LogManager.log(`Loaded ${chalk.bold(this.commands.size)} commands`, "load", "CommandManager");

            if (registerToDiscord) {
                let complete = false;
                let commandArr = [];
                for (const command of this.commands.values()) {
                    if (command.metadata.type !== "CommandInteraction") continue;
                    command.metadata.builder.setName(command.metadata.name);

                    if (command.dmCommand) {
                        command.metadata.builder.setDMPermission(true);
                    } else {
                        command.metadata.builder.setDMPermission(false);
                    };

                    if (command.proctorOnly) {
                        command.metadata.builder.setDescription(`[FISH ADMINISTRATOR ONLY] ${command.metadata.builder.description}`);
                    };
                    
                    commandArr.push(command.metadata.builder.toJSON());

                    if (commandArr.length === this.commands.filter(c => c.metadata.type === "CommandInteraction").size) {
                        complete = true;
                    };

                    if (complete) {
                        await this.registerCommands(ctx, commandArr);
                        LogManager.log(`Registered ${chalk.bold(this.commands.size)} commands to Discord`, "load", "CommandManager");
                        return true;
                    };
                };
            } else {
                return true;
            };
        };
    };
};