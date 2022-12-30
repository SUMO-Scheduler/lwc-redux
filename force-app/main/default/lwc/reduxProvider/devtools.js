// import actions from './actions';
const devtoolsMiddleware = (context) => (store) => (next) => (action) => {
    const provider = context();
    const result = next(action);
    provider.dispatchAction({ action, state: store.getState() });
    // actions.dispatch({ action, state: store.getState() });
    return result;
};

export const getDevtoolsExtension = (context) => ({
    middleware: [devtoolsMiddleware(context)]
});

/**
 * https://github.com/reduxjs/redux-devtools/blob/main/docs/Integrations/Remote.md#5-listening-for-monitor-events
 * TODO: chech if we really need createStore inside this enhancer
 */
export const devtoolsEnhancer = (createStore) => (reducer, initialState, enhancer) => {
    const devtoolsReducer = (state, action) => {
        if (action.type === 'DISPATCH' && action.payload.type === 'JUMP_TO_ACTION') {
            return (typeof action.state === 'string' && JSON.parse(action.state)) || action.state;
        }
        return reducer(state, action);
    };

    return createStore(devtoolsReducer, initialState, enhancer);
};
