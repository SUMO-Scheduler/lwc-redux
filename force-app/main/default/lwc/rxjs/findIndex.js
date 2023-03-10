import { FindValueOperator } from './find';
export function findIndex(predicate, thisArg) {
    return (source) => source.lift(new FindValueOperator(predicate, source, true, thisArg));
}
//# sourceMappingURL=findIndex.js.map