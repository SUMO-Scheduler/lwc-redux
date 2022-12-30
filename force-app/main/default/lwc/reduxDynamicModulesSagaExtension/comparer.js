// copied from https://github.com/microsoft/redux-dynamic-modules

export function sagaEquals(a, b) {
    if (typeof a === 'function' && typeof b === 'function') {
        return a === b;
    }

    if (!a || !b) {
        return a === b;
    }

    if (typeof a === 'function') {
        return a === b.saga && !b.argument;
    } else if (typeof b === 'function') {
        return a.saga === b && !a.argument;
    }

    // both are objects
    return (
        a.saga === b.saga && a.argument === b.argument // TODO: This needs to be a deep equals
    );
}
