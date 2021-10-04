module.exports = {
    discord: {
        clientID: "ClientID", // The client ID of this Songfish instance
        clientToken: "Token" // The Discord bot token for Songfish
    },
    databases: {
        url: "redis://127.0.0.1:27017/"
        // Supports Mongo and Redis out of the box
        // Leaving it blank will use in-memory Keyv, however all data will clear after stopping Songfish.
        // Support for MySQL, Postgres, and many other databases are available. As long as it's supported by Keyv, you can use it.
        // Third party database adapters are unsupported, however, and are not guaranteed to work.
    },
    lavalink: { 
        nodes: [
            {
                host: "127.0.0.1", // The host of the Lavalink server
                port: 2333, // The port of the Lavalink server
                password: "ExamplePassword" // The password to access Lavalink
            },
        ]
    },
    spotify: {
        client: { // The client ID and secret to authenticate with Spotify
            id: null, // Your Spotify Client ID
            secret: null // Your Spotify client secret
        },
        autoResolveYoutubeTracks: false, // Enable this to automatically resolve tracks from YouTube (could potentialy get you banned from YouTube)
        loaders: ["track", "album", "artist", "playlist"]
    },
    proctors: ["USERID"] // User IDs of the Discord users who will serve as the "proctors", or administrators, of the bot
};