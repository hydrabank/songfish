import Keyv from "keyv";

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