import { Observable } from './Observable';
import { noop } from './noop';
export const NEVER = new Observable(noop);
export function never() {
    return NEVER;
}
//# sourceMappingURL=never.js.map