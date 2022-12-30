import { of } from './of';
import { concatAll } from './concatAll';
export function concat(...observables) {
    return concatAll()(of(...observables));
}
//# sourceMappingURL=concat.js.map