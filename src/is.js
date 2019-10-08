const _ = require('underscore');

module.exports = {
    Function: f => _.isFunction(f),
    String: s => _.isString(s),
    Object: o => _.isObject(o),
    Undefined: u => _.isUndefined(u),
    Null: n => _.isNull(n),
    Empty: e => _.isEmpty(e),
    Boolean: b => _.isBoolean(b),
}
