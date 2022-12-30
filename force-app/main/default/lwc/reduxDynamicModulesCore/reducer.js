// copied from https://github.com/microsoft/redux-dynamic-modules

import { combineReducers } from 'c/redux';
import { getStringRefCounter } from './refcounter';

/**
 * Adds reference counting to reducer manager and adds/remove keys only when ref count is zero
 */
export function getRefCountedReducerManager(manager) {
    const reducerKeyRefCounter = getStringRefCounter();
    Object.keys(manager.getReducerMap()).forEach((key) => reducerKeyRefCounter.add(key));

    return {
        reduce: manager.reduce,
        getReducerMap: manager.getReducerMap,
        add: (key, reducer) => {
            if (reducerKeyRefCounter.getCount(key) === 0) {
                manager.add(key, reducer);
            }

            reducerKeyRefCounter.add(key);
        },
        remove: (key) => {
            reducerKeyRefCounter.remove(key);

            if (reducerKeyRefCounter.getCount(key) === 0) {
                manager.remove(key);
            }
        }
    };
}

/**
 * Create a combined reducer as in the fashion of Redux's combineReducers() function,
 * but allows for the dynamic registration of additional reducers
 * @param initialReducers The initial set of reducers
 * @returns An object with three functions: the reducer, an addReducer function, and a removeReducer function
 */
export function getReducerManager(initialReducers, reducerCombiner) {
    if (!reducerCombiner) {
        reducerCombiner = combineReducers;
    }

    let combinedReducer = reducerCombiner(initialReducers);
    const reducers = { ...initialReducers };
    let keysToRemove = [];

    const reduce = (state, action) => {
        if (keysToRemove.length > 0) {
            state = { ...state };
            for (let key of keysToRemove) {
                delete state[key];
            }
            keysToRemove = [];
        }

        if (state === undefined) {
            state = {};
        }

        return combinedReducer(state, action);
    };

    return {
        getReducerMap: () => reducers,
        reduce,
        add: (key, reducer) => {
            if (!key || reducers[key]) {
                return;
            }

            reducers[key] = reducer;
            combinedReducer = getCombinedReducer(reducers, reducerCombiner);
        },
        remove: (key) => {
            if (!key || !reducers[key]) {
                return;
            }

            delete reducers[key];
            keysToRemove.push(key);
            combinedReducer = getCombinedReducer(reducers, reducerCombiner);
        }
    };
}

function getCombinedReducer(reducerMap, reducerCombiner) {
    if (!reducerMap || Object.keys(reducerMap).length === 0) {
        return (state) => state || null;
    }
    return reducerCombiner(reducerMap);
}
