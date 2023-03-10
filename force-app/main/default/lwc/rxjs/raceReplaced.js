import { isArray } from './isArray';
import { race as raceStatic } from './race';
export function race(...observables) {
    return function raceOperatorFunction(source) {
        if (observables.length === 1 && isArray(observables[0])) {
            observables = observables[0];
        }
        return source.lift.call(raceStatic(source, ...observables));
    };
}
//# sourceMappingURL=race.js.map