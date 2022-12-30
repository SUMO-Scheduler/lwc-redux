export const match = (arg, factories, name, componentName = '') => {
    for (let i = factories.length - 1; i >= 0; i--) {
        const result = factories[i](arg);
        if (result) return result;
    }

    return () => {
        const message = `Invalid value of type ${typeof arg} for ${name} argument when connecting component ${componentName}.`;
        // eslint-disable-next-line no-console
        console.error(message);
        throw new Error(message);
    };
};
