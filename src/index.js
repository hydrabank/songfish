const chalk = require("chalk");
const majorNodeV = parseInt(process.versions.node.split(".")[0].trim());
const minorNodeV = parseInt(process.versions.node.split(".")[1].trim());

if (majorNodeV < 16) {
    console.log(chalk["red"].bold(`You are running Node.js version ${majorNodeV}.${minorNodeV}. The minimum Node.js version required to run this app is version 16.6. Please install a newer version of Node.`));
    process.exit(1);
} else {
    if (majorNodeV === 16) {
        if (minorNodeV <= 5) {
            console.log(chalk["red"].bold(`You are running Node.js version ${majorNodeV}.${minorNodeV}. The minimum Node.js version required to run this app is version 16.6. Please install a newer version of Node.`));
            process.exit(1);
        };
    }
};

const Keyv = require("keyv");
const API = require("@discordjs/rest");
const config = require("../config.js");
const fs = require("fs");
const path = require("path");
const { Client, Intents, MessageEmbed, Options } = require("discord.js-light");
const { Routes } = require("discord-api-types/v9"); 
const { Cluster } = require("lavaclient");
const { load } = require("@lavaclient/spotify");

require("@lavaclient/queue/register");

if (config.spotify.client.secret) load({
    client: {
        id: config.spotify.client.id,
        secret: config.spotify.client.secret
    },
    autoResolveYoutubeTracks: config.spotify.autoResolveYoutubeTracks,
    loaders: config.spotify.loaders
});

const client = new Client({ intents: [Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES],
    makeCache: Options.cacheWithLimits({
        ApplicationCommandManager: 0,
        BaseGuildEmojiManager: 0, 
        ChannelManager: 0, 
        GuildChannelManager: 0, 
        GuildBanManager: 0,
        GuildInviteManager: 0, 
        GuildManager: Infinity, 
        GuildMemberManager: 0, 
        GuildStickerManager: 0, 
        MessageManager: 0, 
        PermissionOverwriteManager: 0, 
        PresenceManager: 0, 
        ReactionManager: 0, 
        ReactionUserManager: 0, 
        RoleManager: 0, 
        StageInstanceManager: 0, 
        ThreadManager: 0, 
        ThreadMemberManager: 0, 
        UserManager: 0,
        VoiceStateManager: Infinity
    })
});

client.db = new Keyv(config.databases.url, { namespace: config.databases.namespace });
client.db.on("error", (e) => console.error(`${chalk.red(`DB ERR `)} || ${e}`));
client.commands = new Map();

client.config = config;

const lavalink = new Cluster({
    nodes: config.lavalink.nodes,
    sendGatewayPayload: (id, payload) => client.guilds.cache.get(id).shard.send(payload),
});

client.ws.on("VOICE_STATE_UPDATE", (data) => client.lavalink.handleVoiceUpdate(data));
client.ws.on("VOICE_SERVER_UPDATE", (data) => client.lavalink.handleVoiceUpdate(data));

let cmdMetadata = [];

const cmdDir = fs.readdirSync(path.join(__dirname + "/interactions")).filter(file => file.endsWith(".js"));

for (const f of cmdDir) {
    const cmd = require(`./interactions/${f}`);
    cmdMetadata.push(cmd.metadata.toJSON());
    client.commands.set(cmd.metadata.toJSON().name, cmd);
};

async function postCommands() {
    const api = new API.REST({ version: "9" }).setToken(config.discord.clientToken);
    
    if (config.testing === true) api.put(Routes.applicationGuildCommands(config.discord.clientID, "893746967098818560"), { body: cmdMetadata });
    else await api.put(Routes.applicationCommands(config.discord.clientID), { body: cmdMetadata });

    return true;
};

client.on("ready", function () {
    let status = { type: "LISTENING", content: "music! 🎵" };
    if (config.discord.status.type) status.type = config.discord.status.type;
    if (config.discord.status.content) status.content = config.discord.status.content;
    console.log(`${chalk.green("READY")} || ${client.user.tag} is ready (${new Date().toUTCString()})`);
    client.user.setActivity(status.content, { type: status.type });
    lavalink.connect(client.user.id);
    client.lavalink = lavalink;
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;
    
    const authorized = await client.db.get(`${interaction.guild.id}.authorized`);
    if (!authorized && interaction.commandName !== "invitemanager") return interaction.reply("This server is not authorized to use Songfish. Please apply for access at https://songfish.danny.works.");

    let cmdErr;
    interaction.guild.me = await interaction.guild.members.fetch(client.user.id).catch(() => { cmdErr = true; });

    if (cmdErr) return interaction.reply("Songfish isn't in the server as a bot! Please reinvite it to this server as both a slash command provider and a bot.");

    let cmdUsage = await client.db.get(`usage_${interaction.commandName}`);
    if (!Array.isArray(cmdUsage)) cmdUsage = [];

    cmdUsage.push({ timestamp: Date.now() });

    try {
        const isAsync = client.commands.get(interaction.commandName).run.constructor.name === "AsyncFunction";
        if (isAsync) {
            client.commands.get(interaction.commandName).run(client, interaction).catch(e => {
                console.error(chalk.red(`INTERACTION ERROR ` + "|| " + e));
                interaction.reply(`An error occurred whilst running this command.`);
            });
        } else {
            client.commands.get(interaction.commandName).run(client, interaction);
        }
    } catch (e) {
        console.error(chalk.red(`INTERACTION ERROR || ` + e));
    };
});


(async function () {
    await postCommands();
    await client.login(config.discord.clientToken);
})();