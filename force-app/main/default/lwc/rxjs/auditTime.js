import { async } from './async';
import { audit } from './audit';
import { timer } from './timer';
export function auditTime(duration, scheduler = async) {
    return audit(() => timer(duration, scheduler));
}
//# sourceMappingURL=auditTime.js.map