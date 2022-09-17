import { Client, GatewayIntentBits } from 'discord.js';
import path from 'path';
import fs from 'fs';

import CommandsManager from './lib/CommandsManager';
import DatabaseManager from './lib/DatabaseManager';
import LogManager from './lib/LogManager';
import PoruManager from './lib/PoruManager';
import config from "../config.js";
import chalk from 'chalk';

let ctx = {
    client: { type: Client },
    CommandManager: { type: CommandsManager },
    DatabaseManagers: { type: DatabaseManager },
    LogManager: { type: LogManager }
};

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages]
});

const databases = {
    main: new DatabaseManager({ connectionUri: config.databases.url, databaseName: config.databases.namespace + "_main" })
};

const commands = new CommandsManager({ database: databases.main });

ctx.client = client;
ctx.CommandManager = commands;
ctx.DatabaseManagers = databases;
ctx.LogManager = LogManager;
ctx.config = config;
ctx.PoruManager = new PoruManager({ ctx, database: databases.queue });

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) { // Taken from https://discordjs.guide/creating-your-bot/event-handling.html#reading-event-files, forgot how to bind events lol
	const filePath = path.join(eventsPath, file);
    try {
        const { evt } = require(filePath);
        
        if (evt.once) {
            try {
                client.once(evt.name, (...args) => evt.exec(ctx, ...args));
            } catch (e) {
                ctx.LogManager.log(`An error occurred whilst running the one-time event ${chalk.bold(evt.name)}: ${e.stack ? e.stack : e}`, "error", "Fish SDK");
            };
        } else {
            try {
                client.on(evt.name, (...args) => evt.exec(ctx, ...args));
            } catch (e) {
                ctx.LogManager.log(`An error occurred whilst running the event ${chalk.bold(evt.name)}: ${e.stack ? e.stack : e}`, "error", "Fish SDK");
            };
        };
    } catch (e) {
        ctx.LogManager.log(`An error occurred whilst loading the event ${chalk.bold(file)}: ${e.stack ? e.stack : e}`, "error", "Fish SDK");
    };
};

(async () => {
    await ctx.CommandManager.loadCommands(ctx, true);
    
    client.login(config.discord.clientToken);
})();