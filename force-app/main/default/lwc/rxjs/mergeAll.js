import { mergeMap } from './mergeMap';
import { identity } from './identity';
export function mergeAll(concurrent = Number.POSITIVE_INFINITY) {
    return mergeMap(identity, concurrent);
}
//# sourceMappingURL=mergeAll.js.map