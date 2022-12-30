import { async } from './async';
import { TimeoutError } from './TimeoutError';
import { timeoutWith } from './timeoutWith';
import { throwError } from './throwError';
export function timeout(due, scheduler = async) {
    return timeoutWith(due, throwError(new TimeoutError()), scheduler);
}
//# sourceMappingURL=timeout.js.map