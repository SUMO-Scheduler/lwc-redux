import { iterator as Symbol_iterator } from './iterator';
export function isIterable(input) {
    return input && typeof input[Symbol_iterator] === 'function';
}
//# sourceMappingURL=isIterable.js.map