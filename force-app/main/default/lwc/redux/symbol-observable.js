import mode from '@salesforce/label/c.MODE';
// Inlined version of the `symbol-observable` polyfill
export default (() =>
  (typeof Symbol === 'function' && Symbol.observable) || '@@observable')()
