"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNotEmpty = exports.isLtEq = exports.isLt = exports.isLenLtEq = exports.isLenLt = exports.isLenGtEq = exports.isLenGt = exports.isLenEq = exports.isGtEq = exports.isGt = exports.isFunc = exports.isEq = exports.isEmptyStr = exports.isEmptyObj = exports.isEmptyArr = exports.isEmpty = exports.isEl = exports.isBool = exports.isArr = exports.inObj = exports.hasKeyVal = exports.hasKeyTruthy = exports.hasKeyTrue = exports.hasKeysVal = exports.hasKeyStr = exports.hasKeyRegex = exports.hasKeyObj = exports.hasKeyNum = exports.hasKeyFunc = exports.hasKeyFalsy = exports.hasKeyFalse = exports.hasKeyBool = exports.hasKeyArr = exports.hasKey = exports.has = exports.getSize = exports.getKeyTrue = exports.getKeyStr = exports.getKeyRegex = exports.getKeyObj = exports.getKeyNum = exports.getKeyFunc = exports.getKeyFalse = exports.getKeyBool = exports.getKeyArr = exports.getKey = exports.getFunc = exports.getArr = exports.get = exports.addChild = void 0;
exports.toUpFirst = exports.toType = exports.toArr = exports.sleep = exports.omit = exports.isURL = exports.isUndefined = exports.isStr = exports.isRegex = exports.isObjEq = exports.isObj = exports.isNum = exports.isNotEmptyStr = exports.isNotEmptyObj = exports.isNotEmptyArr = void 0;
var addChild = function (parents, data) {
    parents = exports.toArr(parents);
    parents.reverse().forEach(function (parent) {
        var _a;
        data = (_a = {}, _a[parent] = data, _a);
    });
    return data;
};
exports.addChild = addChild;
var get = function (path, obj, defaultVal) {
    if (defaultVal === void 0) { defaultVal = undefined; }
    var travel = function (regexp) {
        return String.prototype.split
            .call(path, regexp)
            .filter(Boolean)
            .reduce(function (res, key) {
            return res !== null && res !== undefined ? res[key] : res;
        }, obj);
    };
    var result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
    return result === undefined || result === obj ? defaultVal : result;
};
exports.get = get;
var getArr = function (el, defaultVal) {
    if (defaultVal === void 0) { defaultVal = []; }
    return exports.isArr(el) ? el : defaultVal;
};
exports.getArr = getArr;
var getFunc = function (el, args) {
    if (args === void 0) { args = []; }
    return exports.isFunc(el) ? (exports.isEmpty(args) ? el() : el.apply(void 0, args)) : el;
};
exports.getFunc = getFunc;
var getKey = function (el, key, defaultVal) {
    if (defaultVal === void 0) { defaultVal = null; }
    return exports.hasKey(el, key) ? el[key] : defaultVal;
};
exports.getKey = getKey;
var getKeyArr = function (el, key, defaultVal) {
    if (defaultVal === void 0) { defaultVal = []; }
    return (exports.hasKeyArr(el, key) ? el[key] : defaultVal);
};
exports.getKeyArr = getKeyArr;
var getKeyBool = function (el, key, defaultVal) {
    if (defaultVal === void 0) { defaultVal = false; }
    return (exports.hasKeyBool(el, key) ? el[key] : defaultVal);
};
exports.getKeyBool = getKeyBool;
var getKeyFalse = function (el, key, defaultVal) {
    if (defaultVal === void 0) { defaultVal = false; }
    return (exports.hasKeyFalse(el, key) ? el[key] : defaultVal);
};
exports.getKeyFalse = getKeyFalse;
var getKeyFunc = function (el, key, args, defaultVal) {
    if (args === void 0) { args = []; }
    if (defaultVal === void 0) { defaultVal = exports.getKey(el, key); }
    return exports.hasKeyFunc(el, key)
        ? exports.isEmpty(args)
            ? el[key]()
            : el[key].apply(el, args)
        : defaultVal;
};
exports.getKeyFunc = getKeyFunc;
var getKeyNum = function (el, key, defaultVal) {
    if (defaultVal === void 0) { defaultVal = 0; }
    return (exports.hasKeyNum(el, key) ? el[key] : defaultVal);
};
exports.getKeyNum = getKeyNum;
var getKeyObj = function (el, key, defaultVal) {
    if (defaultVal === void 0) { defaultVal = {}; }
    return (exports.hasKeyObj(el, key) ? el[key] : defaultVal);
};
exports.getKeyObj = getKeyObj;
var getKeyRegex = function (el, key, defaultVal) {
    if (defaultVal === void 0) { defaultVal = null; }
    return (exports.hasKeyRegex(el, key) ? el[key] : defaultVal);
};
exports.getKeyRegex = getKeyRegex;
var getKeyStr = function (el, key, prefix, suffix, defaultVal) {
    if (prefix === void 0) { prefix = ""; }
    if (suffix === void 0) { suffix = ""; }
    if (defaultVal === void 0) { defaultVal = ""; }
    return (exports.hasKeyStr(el, key) ? "" + prefix + el[key] + suffix : defaultVal);
};
exports.getKeyStr = getKeyStr;
var getKeyTrue = function (el, key, defaultVal) {
    if (defaultVal === void 0) { defaultVal = true; }
    return (exports.hasKeyTrue(el, key) ? el[key] : defaultVal);
};
exports.getKeyTrue = getKeyTrue;
var getSize = function (el) {
    if (exports.isObj(el)) {
        el = Object.keys(el).length;
    }
    else if (exports.isStr(el) || exports.isArr(el)) {
        el = el.length;
    }
    else if (exports.isRegex(el)) {
        el = 1;
    }
    return el;
};
exports.getSize = getSize;
var has = function (el, key) {
    return exports.isArr(el) && el.includes(key);
};
exports.has = has;
var hasKey = function (el, key) {
    return exports.isEl(el) &&
        (exports.isArr(el) || exports.isObj(el)) &&
        Object.prototype.hasOwnProperty.call(el, key);
};
exports.hasKey = hasKey;
// If el has a key => array pair
var hasKeyArr = function (el, key) {
    return exports.hasKey(el, key) && exports.isArr(el[key]);
};
exports.hasKeyArr = hasKeyArr;
// If el has a key => boolean pair
var hasKeyBool = function (el, key) {
    return exports.hasKey(el, key) && exports.isBool(el[key]);
};
exports.hasKeyBool = hasKeyBool;
// If el has a key => boolean (false) pair
var hasKeyFalse = function (el, key) {
    return exports.hasKeyFalsy(el, key) && exports.isBool(el[key]);
};
exports.hasKeyFalse = hasKeyFalse;
// If el has a key => boolean (false) pair
var hasKeyFalsy = function (el, key) {
    return exports.hasKey(el, key) && !el[key];
};
exports.hasKeyFalsy = hasKeyFalsy;
// If el has a key => function pair
var hasKeyFunc = function (el, key) {
    return exports.hasKey(el, key) && exports.isFunc(el[key]);
};
exports.hasKeyFunc = hasKeyFunc;
// If el has a key => number pair
var hasKeyNum = function (el, key) {
    return exports.hasKey(el, key) && exports.isNum(el[key]);
};
exports.hasKeyNum = hasKeyNum;
// If el has a key => object pair
var hasKeyObj = function (el, key) {
    return exports.hasKey(el, key) && exports.isObj(el[key]);
};
exports.hasKeyObj = hasKeyObj;
// If el has a key => regexp pair
var hasKeyRegex = function (el, key) {
    return exports.hasKey(el, key) && exports.isRegex(el[key]);
};
exports.hasKeyRegex = hasKeyRegex;
// If el has a key => string pair
var hasKeyStr = function (el, key) {
    return exports.hasKey(el, key) && exports.isStr(el[key]);
};
exports.hasKeyStr = hasKeyStr;
// If el has a set of specific key => value pairs
var hasKeysVal = function (el, pairs) {
    var result = [];
    pairs.forEach(function (pair) {
        result.push(exports.hasKeyVal(el, pair[0], pair[1]));
    });
    return !exports.isEmpty(result) && !result.includes(false);
};
exports.hasKeysVal = hasKeysVal;
// If el has a key => boolean (true) pair
var hasKeyTrue = function (el, key) {
    return exports.hasKeyTruthy(el, key) && exports.isBool(el[key]);
};
exports.hasKeyTrue = hasKeyTrue;
// If el has a key => boolean (true) pair
var hasKeyTruthy = function (el, key) {
    return exports.hasKey(el, key) && !!el[key];
};
exports.hasKeyTruthy = hasKeyTruthy;
// If el has a specific key => value pair
var hasKeyVal = function (el, key, val) {
    return exports.hasKey(el, key) && el[key] == val;
};
exports.hasKeyVal = hasKeyVal;
var inObj = function (obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
};
exports.inObj = inObj;
var isArr = function (el) { return Array.isArray(el); };
exports.isArr = isArr;
var isBool = function (el) { return exports.toType(el) == "boolean"; };
exports.isBool = isBool;
var isEl = function (el) { return el && el != null && !exports.isUndefined(el); };
exports.isEl = isEl;
var isEmpty = function (el) { return !exports.isLenGt(0, el); };
exports.isEmpty = isEmpty;
var isEmptyArr = function (el) { return exports.isArr(el) && !exports.isLenGt(0, el); };
exports.isEmptyArr = isEmptyArr;
var isEmptyObj = function (el) { return exports.isObj(el) && !exports.isLenGt(0, el); };
exports.isEmptyObj = isEmptyObj;
var isEmptyStr = function (el) { return exports.isStr(el) && !exports.isLenGt(0, el); };
exports.isEmptyStr = isEmptyStr;
var isEq = function (el1, el2) {
    return exports.isEl(el1) && exports.isEl(el2) && el1 == el2;
};
exports.isEq = isEq;
var isFunc = function (el) {
    return exports.toType(el) == "function" || exports.toType(el) == "asyncfunction";
};
exports.isFunc = isFunc;
var isGt = function (el1, el2) {
    return exports.isEl(el1) && exports.isEl(el2) && el1 > el2;
};
exports.isGt = isGt;
var isGtEq = function (el1, el2) {
    return exports.isEl(el1) && exports.isEl(el2) && el1 >= el2;
};
exports.isGtEq = isGtEq;
var isLenEq = function (len, el) {
    return exports.isEl(el) && exports.getSize(el) == len;
};
exports.isLenEq = isLenEq;
var isLenGt = function (len, el) {
    return exports.isEl(el) && exports.getSize(el) > len;
};
exports.isLenGt = isLenGt;
var isLenGtEq = function (len, el) {
    return exports.isEl(el) && exports.getSize(el) >= len;
};
exports.isLenGtEq = isLenGtEq;
var isLenLt = function (len, el) {
    return exports.isEl(el) && exports.getSize(el) < len;
};
exports.isLenLt = isLenLt;
var isLenLtEq = function (len, el) {
    return exports.isEl(el) && exports.getSize(el) <= len;
};
exports.isLenLtEq = isLenLtEq;
var isLt = function (el1, el2) {
    return exports.isEl(el1) && exports.isEl(el2) && el1 < el2;
};
exports.isLt = isLt;
var isLtEq = function (el1, el2) {
    return exports.isEl(el1) && exports.isEl(el2) && el1 <= el2;
};
exports.isLtEq = isLtEq;
var isNotEmpty = function (el) { return exports.isLenGt(0, el); };
exports.isNotEmpty = isNotEmpty;
var isNotEmptyArr = function (el) { return exports.isArr(el) && exports.isLenGt(0, el); };
exports.isNotEmptyArr = isNotEmptyArr;
var isNotEmptyObj = function (el) { return exports.isObj(el) && exports.isLenGt(0, el); };
exports.isNotEmptyObj = isNotEmptyObj;
var isNotEmptyStr = function (el) { return exports.isStr(el) && exports.isLenGt(0, el); };
exports.isNotEmptyStr = isNotEmptyStr;
var isNum = function (el) { return exports.toType(el) == "number"; };
exports.isNum = isNum;
var isObj = function (el) { return exports.toType(el) == "object"; };
exports.isObj = isObj;
var isObjEq = function (obj1, obj2, keys) {
    if (keys === void 0) { keys = ["name"]; }
    var result = true;
    keys.forEach(function (key) {
        result =
            result &&
                exports.hasKeyStr(obj1, key) &&
                exports.hasKeyStr(obj2, key) &&
                obj1[key] == obj2[key];
    });
    return result;
};
exports.isObjEq = isObjEq;
var isRegex = function (el) { return exports.toType(el) == "regexp"; };
exports.isRegex = isRegex;
var isStr = function (el) { return exports.toType(el) == "string"; };
exports.isStr = isStr;
var isUndefined = function (el) { return exports.toType(el) == "undefined"; };
exports.isUndefined = isUndefined;
var isURL = function (el) {
    return el && el != null && el.startsWith("https://");
};
exports.isURL = isURL;
exports.mergeArrs = function (arr1, arr2, comp, action, cleaner) {
    if (cleaner === void 0) { cleaner = function (el) { return el.filter(Boolean); }; }
    var A = __spreadArray([], arr1);
    var B = __spreadArray([], arr2);
    var intersection = [];
    var result = [];
    arr1.forEach(function (el1, i1) {
        arr2.forEach(function (el2, i2) {
            if (comp(el1, el2)) {
                intersection.push(action(el1, el2));
                delete A[i1];
                delete B[i2];
            }
        });
    });
    result.push.apply(result, __spreadArray(__spreadArray(__spreadArray([], A), B), intersection));
    result = cleaner(result);
    return result;
};
var omit = function (obj, omitKey) {
    return Object.keys(obj)
        .filter(function (key) { return key != omitKey; })
        .reduce(function (result, key) {
        var _a;
        return (__assign(__assign({}, result), (_a = {}, _a[key] = obj[key], _a)));
    }, {});
};
exports.omit = omit;
var sleep = function (ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
exports.sleep = sleep;
var toArr = function (el) { return (exports.isArr(el) ? el : [el]); };
exports.toArr = toArr;
// Function taken from:
// https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
var toType = function (obj) {
    return ({}.toString
        .call(obj)
        .match(/\s([a-zA-Z]+)/)[1]
        .toLowerCase());
};
exports.toType = toType;
var toUpFirst = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
exports.toUpFirst = toUpFirst;
