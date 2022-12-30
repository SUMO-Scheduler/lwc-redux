import { Observable } from './Observable';
import { subscribeToIterable } from './subscribeToIterable';
import { scheduleIterable } from './scheduleIterable';
export function fromIterable(input, scheduler) {
    if (!input) {
        throw new Error('Iterable cannot be null');
    }
    if (!scheduler) {
        return new Observable(subscribeToIterable(input));
    }
    else {
        return scheduleIterable(input, scheduler);
    }
}
//# sourceMappingURL=fromIterable.js.map