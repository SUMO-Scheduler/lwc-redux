import { CombineLatestOperator } from './combineLatest';
export function combineAll(project) {
    return (source) => source.lift(new CombineLatestOperator(project));
}
//# sourceMappingURL=combineAll.js.map