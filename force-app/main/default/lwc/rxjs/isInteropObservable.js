import { observable as Symbol_observable } from './observableReplaced';
export function isInteropObservable(input) {
    return input && typeof input[Symbol_observable] === 'function';
}
//# sourceMappingURL=isInteropObservable.js.map