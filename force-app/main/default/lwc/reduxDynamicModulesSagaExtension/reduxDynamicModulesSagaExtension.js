// copied from https://github.com/microsoft/redux-dynamic-modules
import createSagaMiddleware from 'c/reduxSaga';
import { getRefCountedManager } from 'c/reduxDynamicModulesCore';
import { getSagaManager } from './manager';
import { sagaEquals } from './comparer';

/**
 * Get an extension that integrates saga with the store
 * @param sagaContext The context to provide to the saga
 */
export function getSagaExtension(sagaContext, onError) {
    // Setup the saga middleware
    let sagaMiddleware = createSagaMiddleware({
        context: sagaContext,
        onError
    });

    let _sagaManager = getRefCountedManager(getSagaManager(sagaMiddleware), sagaEquals);

    return {
        middleware: [sagaMiddleware],

        onModuleManagerCreated: (moduleManager) => {
            if (sagaContext) {
                sagaContext.moduleManager = moduleManager;
            }
        },

        onModuleAdded: (mdl) => {
            if (mdl.sagas) {
                _sagaManager.add(mdl.sagas);
            }
        },

        onModuleRemoved: (mdl) => {
            if (mdl.sagas) {
                _sagaManager.remove(mdl.sagas);
            }
        },

        dispose: () => {
            _sagaManager.dispose();
        }
    };
}
