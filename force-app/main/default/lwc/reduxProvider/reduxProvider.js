import { LightningElement, api } from 'lwc';
import {
    REGISTER_REDUX_COMPONENT_EVENT,
    REDUX_COMPONENT_NAME_PROP,
    REDUX_UNSUBSCRIBE_NAME_PROP,
    REDUX_REMOVE_MODULE_NAME_PROP
} from 'c/reduxConstants';

import mapDispatchToPropsFactories from './mapDispatchToProps';
import mapStateToPropsFactories from './mapStateToProps';
import { match } from './utils';
import { createStore } from 'c/reduxDynamicModulesCore';
import { getSagaExtension } from 'c/reduxDynamicModulesSagaExtension';
import { getLoggerExtension } from 'c/reduxDynamicModulesLoggerExtension';
import { getThunkExtension } from 'c/reduxDynamicModulesThunkExtension';
import { getObservableExtension } from 'c/reduxDynamicModulesObservableExtension';
import { devtoolsEnhancer, getDevtoolsExtension } from './devtools';

let _store;
export default class ReduxProvider extends LightningElement {
    @api useThunk = false;
    @api useSaga = false;
    @api useObservable = false;
    @api useDevtools = false;
    @api useLogger = false;
    @api disableCleanupOnDisconnect = false;

    @api
    get modules() {
        return this._modules;
    }
    set modules(input) {
        this._modules = input;
        this.connected && this._addModules();
    }
    @api initialState;

    @api dispatch(action) {
        const { dispatch } = _store || {};
        dispatch && dispatch(action);
    }

    connectedCallback() {
        this.connected = true;
        this.template.addEventListener(REGISTER_REDUX_COMPONENT_EVENT, this.handleEvent);
        this._initializeScripts();
    }

    disconnectedCallback() {
        this.connected = false;
        this.dispatchEvent(
            new CustomEvent('reduxprovider__disconnect', { composed: true, bubbles: true, cancelable: true })
        );
        this.template.removeEventListener(REGISTER_REDUX_COMPONENT_EVENT, this.handleEvent);
        !this.disableCleanupOnDisconnect && this._cleanup();
    }

    handleEvent = (evt) => {
        switch (evt.type) {
            case REGISTER_REDUX_COMPONENT_EVENT:
                evt.stopPropagation();
                this._connect(evt.detail);
                break;
            default:
                break;
        }
    };

    dispatchAction(detail) {
        this.dispatchEvent(
            new CustomEvent('reduxprovider__action', {
                detail,
                composed: true,
                bubbles: true,
                cancelable: true
            })
        );
    }

    _initializeScripts() {
        this._addModules();
        this.dispatchEvent(new CustomEvent('load', { cancelable: true }));
    }

    _createStore(initialModules) {
        const { useThunk, useSaga, useObservable, useLogger, initialState = {}, useDevtools } = this;
        const enhancers = [];
        const extensions = [
            useThunk && getThunkExtension(),
            useLogger && getLoggerExtension(),
            useSaga && getSagaExtension(),
            useObservable && getObservableExtension(),
            useDevtools && getDevtoolsExtension(() => this)
        ].filter((e) => e);

        if (useDevtools) {
            enhancers.push(devtoolsEnhancer);
        }

        _store = createStore(
            {
                initialState,
                extensions,
                enhancers
            },
            ...initialModules
        );

        this.dispatchEvent(
            new CustomEvent('reduxprovider__connect', {
                detail: { state: _store.getState() },
                composed: true,
                bubbles: true,
                cancelable: true
            })
        );
    }

    _addModules() {
        const { modules = [] } = this;
        const initialModules = modules.map((mdl) => {
            if (typeof mdl === 'function') {
                return mdl();
            }
            return mdl;
        });

        if (!_store) {
            this._createStore(initialModules);
        } else {
            this._addedModules = _store.addModules(initialModules);
        }
    }

    _cleanup() {
        if (this._addedModules) {
            this._addedModules.remove();
            this._addedModules = undefined;
        }
    }

    _connect({ mapStateToProps, mapDispatchToProps, context, modules }) {
        const { getState, subscribe, dispatch, addModules } = _store;

        const component = typeof context === 'function' ? context() : context;

        if (modules) {
            const removeModules = addModules(modules);
            component[REDUX_REMOVE_MODULE_NAME_PROP] = removeModules.remove;
        }

        const initMapStateToProps = match(
            mapStateToProps,
            mapStateToPropsFactories,
            'mapStateToProps',
            component[REDUX_COMPONENT_NAME_PROP]
        )();
        const initMapDispatchToProps = match(
            mapDispatchToProps,
            mapDispatchToPropsFactories,
            'mapDispatchToProps',
            component[REDUX_COMPONENT_NAME_PROP]
        )(dispatch);

        if (mapStateToProps) {
            const handleStateChanges = () => {
                if (!this._componentExist(component)) return;

                const state = getState();
                const attributeMap = initMapStateToProps(state, component);
                Object.entries(attributeMap).forEach(([key, value]) => (component[key] = value));
            };

            handleStateChanges();
            component[REDUX_UNSUBSCRIBE_NAME_PROP] = subscribe(handleStateChanges);
        }

        const attributeDispatchMap = initMapDispatchToProps(dispatch, component);
        Reflect.ownKeys(attributeDispatchMap).forEach((key) => (component[key] = attributeDispatchMap[key]));
    }

    _componentExist(component) {
        const computedStyle = window.getComputedStyle(component.template.host);
        return computedStyle.display;
    }
}
