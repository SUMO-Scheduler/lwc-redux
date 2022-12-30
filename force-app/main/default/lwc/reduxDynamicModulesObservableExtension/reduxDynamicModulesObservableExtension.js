// copied from https://github.com/microsoft/redux-dynamic-modules

import { createEpicMiddleware } from "c/reduxObservable";
import { getEpicManager } from "./manager";


export function getObservableExtension() {
    const epicMiddleware = createEpicMiddleware();
    const epicManager = getEpicManager(epicMiddleware);

    return {
        middleware: [epicMiddleware],
        onModuleAdded: (module) => {
            if (module.epics) {
                epicManager.add(module.epics);
            }
        },
        onModuleRemoved: (module) => {
            if (module.epics) {
                epicManager.remove(module.epics);
            }
        },
        dispose: () => {
            epicManager.dispose();
        },
    };
}