import { concat } from './concat';
import { of } from './of';
export function endWith(...array) {
    return (source) => concat(source, of(...array));
}
//# sourceMappingURL=endWith.js.map