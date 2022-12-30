// copied from https://github.com/microsoft/redux-dynamic-modules

import { getMap } from 'c/reduxDynamicModulesCore';
import { sagaEquals } from './comparer';

/**
 * Creates saga items which can be used to start and stop sagas dynamically
 */
export function getSagaManager(sagaMiddleware) {
    const tasks = getMap(sagaEquals);

    return {
        getItems: () => [...tasks.keys],
        add: (sagas) => {
            if (!sagas) {
                return;
            }
            sagas.forEach((saga) => {
                if (saga && !tasks.get(saga)) {
                    tasks.add(saga, runSaga(sagaMiddleware, saga));
                }
            });
        },
        remove: (sagas) => {
            if (!sagas) {
                return;
            }
            sagas.forEach((saga) => {
                if (tasks.get(saga)) {
                    const task = tasks.remove(saga);
                    task.cancel();
                }
            });
        },
        dispose: () => {
            // Cancel everything
            tasks.keys.forEach((k) => tasks.get(k).cancel());
        }
    };
}

function runSaga(sagaMiddleware, sagaRegistration) {
    if (typeof sagaRegistration === 'function') {
        const saga = sagaRegistration;
        return sagaMiddleware.run(saga);
    }
    const saga = sagaRegistration.saga;
    const argument = sagaRegistration.argument;
    return sagaMiddleware.run(saga, argument);
}
