import  {  Subject, from, queueScheduler  }  from  'c/rxjs';
import  { operators }  from  'c/rxjs';
const { map, mergeMap, observeOn, subscribeOn } = operators;
import { StateObservable } from './StateObservable';
import { warn } from './console';
export function createEpicMiddleware(options = {}) {
    // This isn't great. RxJS doesn't publicly export the constructor for
    // QueueScheduler nor QueueAction, so we reach in. We need to do this because
    // we don't want our internal queuing mechanism to be on the same queue as any
    // other RxJS code outside of redux-observable internals.
    const QueueScheduler = queueScheduler.constructor;
    const uniqueQueueScheduler = new QueueScheduler(queueScheduler.schedulerActionCtor);
    if ('production' !== 'production' && typeof options === 'function') {
        throw new TypeError('Providing your root Epic to `createEpicMiddleware(rootEpic)` is no longer supported, instead use `epicMiddleware.run(rootEpic)`\n\nLearn more: https://redux-observable.js.org/MIGRATION.html#setting-up-the-middleware');
    }
    const epic$ = new Subject();
    let store;
    const epicMiddleware = _store => {
        if ('production' !== 'production' && store) {
            // https://github.com/redux-observable/redux-observable/issues/389
            warn('this middleware is already associated with a store. createEpicMiddleware should be called for every store.\n\nLearn more: https://goo.gl/2GQ7Da');
        }
        store = _store;
        const actionSubject$ = new Subject();
        const stateSubject$ = new Subject();
        const action$ = actionSubject$
            .asObservable()
            .pipe(observeOn(uniqueQueueScheduler));
        const state$ = new StateObservable(stateSubject$.pipe(observeOn(uniqueQueueScheduler)), store.getState());
        const result$ = epic$.pipe(map(epic => {
            const output$ = epic(action$, state$, options.dependencies);
            if (!output$) {
                throw new TypeError(`Your root Epic "${epic.name ||
                    '<anonymous>'}" does not return a stream. Double check you\'re not missing a return statement!`);
            }
            return output$;
        }), mergeMap(output$ => from(output$).pipe(subscribeOn(uniqueQueueScheduler), observeOn(uniqueQueueScheduler))));
        result$.subscribe(store.dispatch);
        return next => {
            return action => {
                // Downstream middleware gets the action first,
                // which includes their reducers, so state is
                // updated before epics receive the action
                const result = next(action);
                // It's important to update the state$ before we emit
                // the action because otherwise it would be stale
                stateSubject$.next(store.getState());
                actionSubject$.next(action);
                return result;
            };
        };
    };
    epicMiddleware.run = rootEpic => {
        if ('production' !== 'production' && !store) {
            warn('epicMiddleware.run(rootEpic) called before the middleware has been setup by redux. Provide the epicMiddleware instance to createStore() first.');
        }
        epic$.next(rootEpic);
    };
    return epicMiddleware;
}
