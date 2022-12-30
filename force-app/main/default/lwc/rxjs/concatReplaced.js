import { concat as concatStatic } from './concat';
export function concat(...observables) {
    return (source) => source.lift.call(concatStatic(source, ...observables));
}
//# sourceMappingURL=concat.js.map