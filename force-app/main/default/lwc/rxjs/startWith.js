import { concat } from './concat';
import { isScheduler } from './isScheduler';
export function startWith(...array) {
    const scheduler = array[array.length - 1];
    if (isScheduler(scheduler)) {
        array.pop();
        return (source) => concat(array, source, scheduler);
    }
    else {
        return (source) => concat(array, source);
    }
}
//# sourceMappingURL=startWith.js.map