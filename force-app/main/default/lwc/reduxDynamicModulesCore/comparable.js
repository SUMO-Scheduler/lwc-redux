// copied from https://github.com/microsoft/redux-dynamic-modules

/**
 * We will use it where we can not use the default Map as the Map class do not allow custom compare function
 * @param equals Optional, a comparer to use
 */
export function getMap(equals = (a, b) => a === b) {
    const keys = [];
    const values = {};

    return {
        /**
         * Current set of keys
         */
        keys,
        /**
         * Gets value for given key
         */
        get: (key) => {
            if (!key) {
                return undefined;
            }

            const index = keys.findIndex((k) => k && equals(k, key));
            if (index === -1) {
                return undefined;
            }
            return values[index];
        },
        /**
         * Adds the given key and value
         */
        add: (key, value) => {
            if (!key) {
                return;
            }
            const index = keys.findIndex((k) => k && equals(k, key));
            if (index === -1) {
                keys.push(key);
                values[keys.length - 1] = value;
            }
        },
        /**
         * Removes the given key and returns the value object if key was found
         */
        remove: (key) => {
            if (!key) {
                return undefined;
            }
            const index = keys.findIndex((k) => k && equals(k, key));
            if (index === -1) {
                return undefined;
            }
            delete keys[index];
            const value = values[index];
            delete values[index];
            return value;
        }
    };
}
