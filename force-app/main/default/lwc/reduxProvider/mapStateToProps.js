import { wrapMapToPropsConstant, wrapMapToPropsFunc } from './wrapMapToProps';

export const whenMapStateToPropsIsFunction = (mapStateToProps) => {
    return typeof mapStateToProps === 'function' ? wrapMapToPropsFunc(mapStateToProps) : undefined;
};

export const whenMapStateToPropsIsMissing = (mapStateToProps) => {
    return !mapStateToProps ? wrapMapToPropsConstant(() => ({})) : undefined;
};

export default [whenMapStateToPropsIsFunction, whenMapStateToPropsIsMissing];
