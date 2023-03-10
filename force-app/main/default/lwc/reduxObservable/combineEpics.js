import  {  merge  }  from  'c/rxjs';
/**
  Merges all epics into a single one.
 */
export function combineEpics(...epics) {
    const merger = (...args) => merge(...epics.map(epic => {
        const output$ = epic(...args);
        if (!output$) {
            throw new TypeError(`combineEpics: one of the provided Epics "${epic.name || '<anonymous>'}" does not return a stream. Double check you\'re not missing a return statement!`);
        }
        return output$;
    }));
    // Technically the `name` property on Function's are supposed to be read-only.
    // While some JS runtimes allow it anyway (so this is useful in debugging)
    // some actually throw an exception when you attempt to do so.
    try {
        Object.defineProperty(merger, 'name', {
            value: `combineEpics(${epics.map(epic => epic.name || '<anonymous>').join(', ')})`,
        });
    }
    catch (e) { }
    return merger;
}
