import { wrapMapToPropsConstant, wrapMapToPropsFunc } from './wrapMapToProps';
import { REDUX_DISPATCH_NAME_PROP } from 'c/reduxConstants';
import { bindActionCreators } from 'c/redux';

export const whenMapDispatchToPropsIsFunction = (mapDispatchToProps) => {
    return typeof mapDispatchToProps === 'function' ? wrapMapToPropsFunc(mapDispatchToProps) : undefined;
};

export const whenMapDispatchToPropsIsMissing = (mapDispatchToProps) => {
    return !mapDispatchToProps
        ? wrapMapToPropsConstant((dispatch) => ({ [REDUX_DISPATCH_NAME_PROP]: dispatch }))
        : undefined;
};

export const whenMapDispatchToPropsIsObject = (mapDispatchToProps) => {
    return mapDispatchToProps && typeof mapDispatchToProps === 'object'
        ? wrapMapToPropsConstant((dispatch) => bindActionCreators(mapDispatchToProps, dispatch))
        : undefined;
};

export default [whenMapDispatchToPropsIsFunction, whenMapDispatchToPropsIsMissing, whenMapDispatchToPropsIsObject];
