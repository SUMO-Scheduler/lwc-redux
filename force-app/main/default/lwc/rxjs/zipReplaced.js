import { zip as zipStatic } from './zip';
export function zip(...observables) {
    return function zipOperatorFunction(source) {
        return source.lift.call(zipStatic(source, ...observables));
    };
}
//# sourceMappingURL=zip.js.map