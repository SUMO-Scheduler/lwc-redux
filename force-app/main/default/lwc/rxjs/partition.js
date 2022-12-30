import { not } from './not';
import { subscribeTo } from './subscribeTo';
import { filter } from './filter';
import { Observable } from './Observable';
export function partition(source, predicate, thisArg) {
    return [
        filter(predicate, thisArg)(new Observable(subscribeTo(source))),
        filter(not(predicate, thisArg))(new Observable(subscribeTo(source)))
    ];
}
//# sourceMappingURL=partition.js.map