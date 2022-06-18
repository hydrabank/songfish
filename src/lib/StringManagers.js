const path = require("path");
/**
 * Provides localization for strings in Songfish.
 * @param {string} stringId The ID of the string to localize.
 * @param {string} locale The locale to localize the string to.
 */
class LocalizationManager {
    /**
     * Localizes/translates a string ID using the specified locale.
     * @param {string} category The category of the string to localize.
     * @param {string} stringId The ID of the string to localize.
     * @param {string} locale The locale to localize the string to.
     * @param {string} customVariable The custom variable to replace in the string. Use <!--CV--> to indicate the position of the custom variable.
     * @returns {string} The localized string.
     */
    static localizeString(category, stringId, rawLocale, customVariable) {
        let locale = rawLocale;
        if (rawLocale.split("-")[1] == undefined) {
            locale = rawLocale + `-${rawLocale.toUpperCase()}`;
        };
        const strings = require(path.join(__dirname + "/../i18n/locales/moduleconfig.js")).content[category];
        if (!strings[stringId]) return new Error(`String ID ${stringId} not found (locale: ${locale})`);
        if (!strings[stringId][locale]) locale = "en-GB";
        if (!strings[stringId]["en-GB"]) return new Error(`No default (en-GB) string found for string ID ${stringId} (locale: ${locale})`);
        return strings[stringId][locale].replace("<!--CV-->", customVariable); 
    };
};

module.exports = { LocalizationManager };