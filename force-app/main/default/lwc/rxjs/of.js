import { isScheduler } from './isScheduler';
import { fromArray } from './fromArray';
import { scheduleArray } from './scheduleArray';
export function of(...args) {
    let scheduler = args[args.length - 1];
    if (isScheduler(scheduler)) {
        args.pop();
        return scheduleArray(args, scheduler);
    }
    else {
        return fromArray(args);
    }
}
//# sourceMappingURL=of.js.map