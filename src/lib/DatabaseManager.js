import Keyv from "keyv";
import chalk from "chalk";
import LogManager from './LogManager';
import os from "os";
import { fetch } from "undici";

export default class DatabaseManager {
    /**
     * Initialize a database connection.
     * @param { Object } options The options to use for the database connection.
     * @param { string } options.connectionUri The connection URI to pass onto Keyv.
     * @param { string } options.databaseName The namespace to use for the database.
     * @returns { DatabaseManager } An instance of the DatabaseManager.
     */
    constructor({ connectionUri, databaseName = "songfish_default" }) {
        this.options = {
            connectionUri: connectionUri,
            databaseName: databaseName
        };

        this.database = new Keyv(this.options.connectionUri, { namespace: this.options.databaseName });

        this.database.get("__lastConnected").then(async (lastConnected) => {
            const ipf = await fetch("https://api.ipgeolocation.io/getip", {

            }).then((res) => res.json()).catch((e) => {
                LogManager.log(`Failed to fetch IP info: ${e}`, "error", "DatabaseManager");
            });
            LogManager.log(`${chalk.green["bold"]("Successfully")} connected to database`, "info", "DatabaseManager");
            if (lastConnected) {
                LogManager.log(`Last connected to ${chalk.bold(lastConnected?.hostname)} ${chalk.bold(`(${lastConnected.ip} @ ${new Date(lastConnected?.timestamp).toISOString()})`)}`, "info", "DatabaseManager");
            } else {
                LogManager.log(`Last connected to ${chalk.bold(os.hostname)} (${chalk.bold(`${ipf.ip} @ now`)})`, "info", "DatabaseManager");
            };

            this.database.set("__lastConnected", {
                hostname: os.hostname(),
                timestamp: new Date().toISOString(),
                ip: ipf.ip || "(IP unknown)"
            });
        }).catch((e) => {
            LogManager.log(`${chalk.red["bold"]("Failed")} connecting to database: ${e}`, "error", "DatabaseManager");
        });
    };
    
    /**
     * Get the raw Keyv instance used by the DatabaseManager (if absolutely necessary).
     * @returns { Keyv } The Keyv instance.
     */
    getDatabase() {
        return this.database;
    };

    /**
     * Get a value from the database.
     * @param { string } key The key fetch from the database
     * @returns { Promise<any> } The value from the database (or null if the key does not exist in the database).  
     */
    async get(key) {
        const request = await this.database.get(key);

        if (request === null || request === undefined || request === "") {
            return null;
        };

        return request;
    };

    /**
     * Set a value in the database. Returns a promise that resolves when the value has been set.
     * @param {string} key The key to set in the database alongside the value.
     * @param {any} value The data that will be stored alongside the key. 
     * @returns {Promise<any>} A promise that resolves when the value has been set.
     */
    async set(key, value) {
        await this.database.set(key, value);
        return value;
    };

    /**
     * Delete a value in the database. Returns a promise that will most likely resolve when the value has been deleted.
     * @param {string} key The key to delete from the database.
     * @returns {Promise<boolean>} A promise that resolves when the value has been deleted (will only return true, or the function will throw an error).
     */
    async delete(key) {
        await this.database.delete(key);
        return true;
    };

    /**
     * Get all the keys in the database. Returns a promise that resolves when the keys have been retrieved.
     * @returns {Promise<object>} A promise that resolves when the keys have been retrieved.
     */
    async getAllKeys() {
        let keys = {};
        for await (const [key, value] of this.database.iterator()) {
            keys[key] = value;
        };

        return keys;
    }
};