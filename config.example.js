// This is the configuration file for Songfish. It supports JavaScript modules, however unlike the main portions of the bot, it does NOT support Babel.
// Only CommonJS-exported modules are supported.

const { ActivityType } = require("discord.js");
module.exports = {
    discord: {
        clientID: "461995836063088652", // The client ID of this Fish SDK instance. This ID should match with the corresponding bot token in clientToken.
        clientToken: "NzMwODA0MzQzNzkyNDg4MDA2.NOT-A-VALID-TOKEN.vf4NWkeu386VrPXt2pjA5Gm1hST", // The Discord bot token used for Fish SDK.
        status: { // Setting either or both to null will set it to default
            type: ActivityType.Watching, // Use this to configure the descriptive verb that prefixes the status. (SDKv3 uses ActivityType to configure these instead of regular strings; this is a Discord.js v14 change.)
            content: "others listen to music!" // This is the content of the status.
        },
        applicationGuild: { // This configures parameters for the guild, channel, and role IDs that are used for access applications.
            id: "966151942118195252", // The ID of the guild where applications should be sent to.
            channelID: "966153926133055488", // The ID of the channel where applications should be sent to.
            roleID: "993681865720463370" // The ID of the role that should be pinged when an application is sent.
        }
    },
    databases: {
        url: "mongodb://127.0.0.1:27017/songfish",
        // This supports Mongo and Redis out of the box.
        // Leaving it blank will use in-memory Keyv, however all data will clear after stopping Songfish.
        // Support for MySQL, Postgres, and many other databases are available. As long as it's supported by Keyv, you can use it. Just install the corresponding Keyv extension and change the URL to the correct format.
        // The Fish SDK has only been tested in environments with MongoDB and Redis, however, and while we can try to assist with using other databases, this is not a guarantee.
        // ^ However, most other database extensions for Keyv *should* work just fine (given the database-agnostic structure of Keyv).
        namespace: "songfish" // This corresponds to the namespace used in the database. This is useful if you want to use the same database host/cluster for multiple bots.
    },
    lavalink: {
        nodes: [
            {
                name: "Example Node", // Customize the name of the node. This is shown in STDOUT when Songfish connects to this node.
                host: "127.0.0.1", // The host IP or FQDN of the Lavalink node.
                port: "2333", // The host port of the Lavalink node.
                password: "myPassword" // This is the password (or one of the passwords, in some cases) that you configured when setting up Lavalink.
            }
        ]
    },
    proctors: ["181944866987704320"], // This is an array of Discord user IDs that correspond to the Songfish bot administrators (internally called proctors). Administrators have access to the Swiss Knife, a meta-command with various subcommands that allow for administrators to perform various tasks in real time with the bot.
    testing: true, // This can be used to enable testing mode. This will cause the bot to only respond to guild commands in the guild specified by testingServerID.
    testingServerID: "966151942118195252", // The ID of the server to use for testing mode.
    meta: {
        displayName: "Songfish", // The name of the bot. This will be used in strings like descriptions and command responses.
    }
};