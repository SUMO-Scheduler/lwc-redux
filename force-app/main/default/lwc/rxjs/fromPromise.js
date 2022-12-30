import { Observable } from './Observable';
import { subscribeToPromise } from './subscribeToPromise';
import { schedulePromise } from './schedulePromise';
export function fromPromise(input, scheduler) {
    if (!scheduler) {
        return new Observable(subscribeToPromise(input));
    }
    else {
        return schedulePromise(input, scheduler);
    }
}
//# sourceMappingURL=fromPromise.js.map