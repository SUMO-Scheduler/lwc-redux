// copied from https://github.com/microsoft/redux-dynamic-modules

/** Ref counts given object */
export function getObjectRefCounter(equals = (a, b) => a === b, retained = () => false) {
    const objects = [];
    const counts = [];
    return {
        /**
         * Gets ref count of given T
         */
        getCount: (obj) => {
            if (obj === undefined || obj === null) {
                return 0;
            }

            let index = objects.findIndex((o) => o && equals(o, obj));
            if (index === -1) {
                return 0;
            }
            return counts[index];
        },
        /**
         * Add given T or increments ref count
         */
        add: (obj) => {
            if (obj === undefined || obj === null) {
                return;
            }

            let index = objects.findIndex((o) => o && equals(o, obj));
            let count = 1;
            if (index === -1) {
                index = objects.length;
                objects.push(obj);
            } else {
                count = counts[index] + 1;
            }

            // If item is retained then keep it for inifinty
            if (retained(obj)) {
                count = Infinity;
            }

            counts[index] = count;
        },
        /**
         * Decreases ref count for given T, if refcount reaches to zero removes the T and returns true
         */
        remove: (obj) => {
            if (retained(obj)) {
                return false;
            }

            let index = objects.findIndex((o) => o && equals(o, obj));
            if (index === -1) {
                return false;
            }

            if (counts[index] === 1) {
                delete objects[index];
                delete counts[index];
                return true;
            }

            counts[index] = counts[index] - 1;
            return false;
        }
    };
}

/**
 * Ref counts strings
 */
export function getStringRefCounter() {
    const values = {};
    return {
        /**
         * Returns current ref count for the key
         */
        getCount: (key) => {
            if (key === undefined || key === null) {
                return 0;
            }

            return values[key] || 0;
        },
        /**
         * Adds given key for ref counting or increments ref count
         */
        add: (key) => {
            if (key === undefined || key === null) {
                return;
            }

            if (!values[key]) {
                values[key] = 1;
            } else {
                values[key]++;
            }
        },
        /**
         * Decreases ref count for the given key, if the ref count reaches 0 removes the key and returns true
         */
        remove: (key) => {
            if (key === undefined || key === null) {
                return false;
            }

            if (!values[key]) {
                return false;
            }

            if (values[key] === 1) {
                delete values[key];
                return true;
            }

            values[key]--;
            return false;
        }
    };
}
