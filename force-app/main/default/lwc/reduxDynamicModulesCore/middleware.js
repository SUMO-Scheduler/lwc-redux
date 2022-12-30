// copied from https://github.com/microsoft/redux-dynamic-modules

import { createDynamicMiddlewares } from './middlewares';

export const getMiddlewareManager = () => {
    const dynamicMiddlewaresInstance = createDynamicMiddlewares();
    const add = (middlewares) => {
        dynamicMiddlewaresInstance.addMiddleware(...middlewares);
        return middlewares;
    };

    const remove = (middlewares) => {
        middlewares.forEach(dynamicMiddlewaresInstance.removeMiddleware);
        return middlewares;
    };

    return {
        getItems: () => [],
        enhancer: dynamicMiddlewaresInstance.enhancer,
        add,
        remove,
        dispose: () => {
            dynamicMiddlewaresInstance.resetMiddlewares();
        }
    };
};
