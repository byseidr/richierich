import { readdirSync } from "fs";
import path from "path";
import stack, { CallSite } from "callsite";

import { Index, Indexable, UpFirstString, ZeroWidthSpace } from "./types";

export const addChild = (parents: string[] | string, data: any): Indexable => {
    parents = toArr(parents);
    parents.reverse().forEach((parent: string) => {
        data = { [parent]: data };
    });
    return data;
};

export const arrHasVal = (el: any[], val: any): boolean =>
    isArr(el) && el.includes(val);

export const bind = (fn: Function, ...args: any[]): any => {
    const boundFn = fn.bind(null, ...args);
    boundFn.source = fn;
    boundFn.args = args;
    return boundFn;
};

// Function inspired by:
// https://www.webtips.dev/webtips/javascript/how-to-clamp-numbers-in-javascript
export const clamp = (min: number, num: number, max: number) =>
    Math.min(Math.max(min, num), max);

export const collator = (
    options: Intl.CollatorOptions,
    locales: string | string[] = "en-US"
): ((x: string, y: string) => number) => {
    const collator = new Intl.Collator(locales, options);
    return collator.compare;
};

export const convertKeys = (obj: Indexable, action: (el: any) => any) => {
    if (!isObj(obj)) return;
    Object.keys(obj).forEach((key) => {
        const newKey = action(key);
        if (newKey === key) return;
        obj[newKey] = obj[key];
        delete obj[key];
    });
};

export const dateTimeFormat = (
    dateTime: number | Date,
    options: Intl.DateTimeFormatOptions,
    locales: string | string[] = "en-US"
): string => {
    const formatter = new Intl.DateTimeFormat(locales, options);
    return formatter.format(dateTime);
};

export const displayNames = (
    code: string,
    options: Intl.DisplayNamesOptions,
    locales: Intl.LocalesArgument = "en-US"
): string | undefined => {
    const display = new Intl.DisplayNames(locales, options);
    return display.of(code);
};

// Function taken from:
// https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex/6969486#6969486
export const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
};

export const get = (
    path: string,
    obj: Indexable,
    defaultVal: any = undefined
): any => {
    const travel = (regexp: RegExp) =>
        String.prototype.split
            .call(path, regexp)
            .filter(Boolean)
            .reduce(
                (res: Indexable, key: Index) =>
                    res !== null && res !== undefined ? res[key] : res,
                obj
            );
    const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
    return result === undefined || result === obj ? defaultVal : result;
};

export const getArr = (el: any, defaultVal: any[] = []): any[] =>
    isArr(el) ? el : defaultVal;

export const getDir = (
    dirName: string | string[],
    filter = (file: string) => file.endsWith(".js")
) => {
    const result: Indexable = {};
    for (const fileName of readDir(dirName, filter)) {
        const filePath = path.join(...getDirName(dirName), fileName);
        const fileExports = require(filePath);
        result[fileName] = fileExports;
    }
    return result;
};

export const getDirAsArr = (
    dirName: string | string[],
    filter = (file: string) => file.endsWith(".js")
) => Object.values(getDir(dirName, filter));

export const getDirName = (dirName: string | string[]): string[] => {
    dirName = toArr(dirName).filter(Boolean);
    const parDirName = getParDirName(stack());
    if (dirName.length < 2) dirName.unshift(parDirName);
    return dirName;
};

export const getFunc = (el: any, args: any | any[] = []): any =>
    isFunc(el) ? (isEmpty(args) ? el() : el(...toArr(args))) : el;

export const getKey = (
    el?: Indexable | null,
    key?: Index | null,
    defaultVal: any = null
): any => (hasKey(el, key) ? (<Indexable>el)[<Index>key] : defaultVal);

export const getKeyArr = (
    el?: Indexable | null,
    key?: Index | null,
    defaultVal: any[] = []
): any[] => (hasKeyArr(el, key) ? (<Indexable>el)[<Index>key] : defaultVal);

export const getKeyBool = (
    el?: Indexable | null,
    key?: Index | null,
    defaultVal: boolean = false
): boolean => (hasKeyBool(el, key) ? (<Indexable>el)[<Index>key] : defaultVal);

export const getKeyClone = (
    el: Indexable,
    key: Index,
    defaultVal: Indexable
): Indexable => ({
    [key]: getKey(el, key, defaultVal),
});

export const getKeyFalse = (
    el?: Indexable | null,
    key?: Index | null,
    defaultVal: false = false
): false => (hasKeyFalse(el, key) ? (<Indexable>el)[<Index>key] : defaultVal);

export const getKeyFalsy = (
    el?: Indexable | null,
    key?: Index | null,
    defaultVal: any = false
): false => (hasKeyFalsy(el, key) ? (<Indexable>el)[<Index>key] : defaultVal);

export const getKeyFunc = (
    el?: Indexable | null,
    key?: Index | null,
    args: any[] = [],
    defaultVal: any = getKey(el, key)
): any =>
    hasKeyFunc(el, key)
        ? isEmpty(args)
            ? (<Indexable>el)[<Index>key]()
            : (<Indexable>el)[<Index>key](...args)
        : defaultVal;

export const getKeyNum = (
    el?: Indexable | null,
    key?: Index | null,
    defaultVal: number = 0
): number => (hasKeyNum(el, key) ? (<Indexable>el)[<Index>key] : defaultVal);

export const getKeyObj = (
    el?: Indexable | null,
    key?: Index | null,
    defaultVal: Indexable = {}
): Indexable => (hasKeyObj(el, key) ? (<Indexable>el)[<Index>key] : defaultVal);

export const getKeyRegex = (
    el?: Indexable | null,
    key?: Index | null,
    defaultVal: RegExp = new RegExp("")
): RegExp => (hasKeyRegex(el, key) ? (<Indexable>el)[<Index>key] : defaultVal);

export const getKeyStr = (
    el?: Indexable | null,
    key?: Index | null,
    prefix: string = "",
    suffix: string = "",
    defaultVal: string = ""
): string =>
    hasKeyStr(el, key)
        ? `${prefix}${(<Indexable>el)[<Index>key]}${suffix}`
        : defaultVal;

export const getKeyTrue = (
    el?: Indexable | null,
    key?: Index | null,
    defaultVal: true = true
): true => (hasKeyTrue(el, key) ? (<Indexable>el)[<Index>key] : defaultVal);

export const getKeyTruthy = (
    el?: Indexable | null,
    key?: Index | null,
    defaultVal: any = true
): true => (hasKeyTruthy(el, key) ? (<Indexable>el)[<Index>key] : defaultVal);

export const getParDirName = (
    parFileName?: string | CallSite[],
    fileName: string = __filename
) => {
    parFileName = isStr(parFileName)
        ? parFileName
        : getParFileName(<CallSite[]>parFileName, fileName);
    return path.dirname(<string>parFileName ?? fileName);
};

export const getParFileName = (
    stack: CallSite[],
    fileName: string = __filename
) => {
    const file = stack?.find?.((site) => {
        const siteFileName = site.getFileName();
        const fileNameRegExp = new RegExp(`^node:|${escapeRegExp(fileName)}`);
        return siteFileName && !fileNameRegExp.test(siteFileName);
    });
    const parFileName = file?.getFileName();
    if (!parFileName) return;
    return trim(parFileName, "^file:/+");
};

export const getRandomEl = (arr: any[]): any => {
    const index = getRandomInt(0, arr.length);
    return getKey(arr, <string>(<any>index));
};

export const getRandomElByChance = (arr: any[]): any => {
    let result = getKey(arr, <any>0);
    const arrLen = getKeyNum(arr, "length");
    const d = Math.random();
    for (let i = arrLen - 1; i >= 0; --i) {
        const perc = 1 / Math.pow(2, i);
        if (d < perc) {
            result = getKey(arr, <any>i);
            break;
        }
    }
    return result;
};

// Function taken from:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
export const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};

// Function taken from:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
export const getRandomIntInc = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
};

export const getSize = (el: any): number => {
    if (isNum(el)) return el;
    if (isObj(el)) return Object.keys(el).length;
    if (isStr(el) || isArr(el)) return el.length;
    if (isBool(el)) return +el;
    return +!!el;
};

export const getSortedKeys = (el: Indexable): string[] => {
    const keys = Object.keys(el);
    sort(keys);
    return keys;
};

export const getToken = async (prefix = "", suffix = "", uppercase = true) => {
    let result = Math.floor(Date.now() / 1000).toString(36);
    result = `${prefix ?? ""}${result}${suffix ?? ""}`;
    if (uppercase) result = result.toUpperCase();
    await sleep();
    return result;
};

export const has = (el: any[], key: number): boolean =>
    isArr(el) && el.includes(key);

// If el has any key in a set of specific keys
export const hasAnyOfKeys = (
    el?: Indexable | null,
    keys: Index | Index[] | null = []
): boolean => {
    let result: boolean[] = [];
    toArr(keys).forEach((key) => {
        result.push(hasKey(el, key));
    });
    return !isEmpty(result) && result.includes(true);
};

// If el has any key => value pair in a set of specific key => value pairs
export const hasAnyOfKeysVal = (
    el?: Indexable | null,
    pairs: any[][] = []
): boolean => {
    let result: boolean[] = [];
    pairs.forEach((pair) => {
        result.push(hasKeyVal(el, pair[0], pair[1]));
    });
    return !isEmpty(result) && result.includes(true);
};

export const hasKey = (el?: Indexable | null, key?: Index | null): boolean =>
    isEl(el) &&
    isEl(key) &&
    (isArr(el) || isObj(el)) &&
    Object.prototype.hasOwnProperty.call(el, <Index>key);

// If el has a key => array pair
export const hasKeyArr = (el?: Indexable | null, key?: Index | null): boolean =>
    hasKey(el, key) && isArr((<Indexable>el)[<Index>key]);

// If el has a key => boolean pair
export const hasKeyBool = (
    el?: Indexable | null,
    key?: Index | null
): boolean => hasKey(el, key) && isBool((<Indexable>el)[<Index>key]);

// If el has a key => boolean (false) pair
export const hasKeyFalse = (
    el?: Indexable | null,
    key?: Index | null
): boolean => hasKeyFalsy(el, key) && isBool((<Indexable>el)[<Index>key]);

// If el has a key => boolean (false) pair
export const hasKeyFalsy = (
    el?: Indexable | null,
    key?: Index | null
): boolean => hasKey(el, key) && !(<Indexable>el)[<Index>key];

// If el has a key => function pair
export const hasKeyFunc = (
    el?: Indexable | null,
    key?: Index | null
): boolean => hasKey(el, key) && isFunc((<Indexable>el)[<Index>key]);

// If el has a key => number pair
export const hasKeyNum = (el?: Indexable | null, key?: Index | null): boolean =>
    hasKey(el, key) && isNum((<Indexable>el)[<Index>key]);

// If el has a key => object pair
export const hasKeyObj = (el?: Indexable | null, key?: Index | null): boolean =>
    hasKey(el, key) && isObj((<Indexable>el)[<Index>key]);

// If el has a key => regexp pair
export const hasKeyRegex = (
    el?: Indexable | null,
    key?: Index | null
): boolean => hasKey(el, key) && isRegex((<Indexable>el)[<Index>key]);

// If el has a key => string pair
export const hasKeyStr = (el?: Indexable | null, key?: Index | null): boolean =>
    hasKey(el, key) && isStr((<Indexable>el)[<Index>key]);

// If el has a set of specific keys
export const hasKeys = (
    el?: Indexable | null,
    keys: Index | Index[] | null = []
): boolean => {
    let result: boolean[] = [];
    toArr(keys).forEach((key) => {
        result.push(hasKey(el, key));
    });
    return !isEmpty(result) && !result.includes(false);
};

// If el has a set of specific key => value pairs
export const hasKeysVal = (
    el?: Indexable | null,
    pairs: any[][] = []
): boolean => {
    let result: boolean[] = [];
    pairs.forEach((pair) => {
        result.push(hasKeyVal(el, pair[0], pair[1]));
    });
    return !isEmpty(result) && !result.includes(false);
};

// If el has a key => boolean (true) pair
export const hasKeyTrue = (
    el?: Indexable | null,
    key?: Index | null
): boolean => hasKeyTruthy(el, key) && isBool((<Indexable>el)[<Index>key]);

// If el has a key => boolean (true) pair
export const hasKeyTruthy = (
    el?: Indexable | null,
    key?: Index | null
): boolean => hasKey(el, key) && !!(<Indexable>el)[<Index>key];

// If el has a specific key => value pair
export const hasKeyVal = (
    el?: Indexable | null,
    key?: Index | null,
    val?: any
): boolean => hasKey(el, key) && (<Indexable>el)[<Index>key] == val;

export const inObj = (obj: Indexable, key: Index): boolean =>
    Object.prototype.hasOwnProperty.call(obj, key);

export const isArr = (el: any): boolean => Array.isArray(el);

export const isArrArr = (els: any | any[]): boolean => {
    if (!isArr(els)) return false;
    return !(<any[]>els).some((el) => !isArr(el));
};

export const isArrLenEq = (len: number, el: any): boolean =>
    isArr(el) && getSize(el) == len;

export const isArrLenGt = (len: number, el: any): boolean =>
    isArr(el) && getSize(el) > len;

export const isArrLenGtEq = (len: number, el: any): boolean =>
    isArr(el) && getSize(el) >= len;

export const isArrLenLt = (len: number, el: any): boolean =>
    isArr(el) && getSize(el) < len;

export const isArrLenLtEq = (len: number, el: any): boolean =>
    isArr(el) && getSize(el) <= len;

export const isArrLenOp = (len: number, el: any, op: string): boolean => {
    let result = false;
    switch (op) {
        case "==":
            result = isArrLenEq(len, el);
            break;
        case "<=":
            result = isArrLenLtEq(len, el);
            break;
        case ">=":
            result = isArrLenGtEq(len, el);
            break;
        case "<":
            result = isArrLenLt(len, el);
            break;
        case ">":
            result = isArrLenGt(len, el);
            break;
    }
    return result;
};

export const isBool = (el: any): boolean => toType(el) == "boolean";

export const isBoolArr = (els: any | any[]): boolean => {
    if (!isArr(els)) return false;
    return !(<any[]>els).some((el) => !isBool(el));
};

export const isEl = (el: any): boolean => el && el != null && !isUndefined(el);

export const isEmpty = (el: any): boolean => !isLenGt(0, el);

export const isEmptyArr = (el: any): boolean => isArr(el) && !isLenGt(0, el);

export const isEmptyObj = (el: any): boolean => isObj(el) && !isLenGt(0, el);

export const isEmptyStr = (el: any): boolean => isStr(el) && !isLenGt(0, el);

export const isEq = (el1: any, el2: any): boolean =>
    isEl(el1) && isEl(el2) && el1 == el2;

export const isFunc = (el: any): boolean =>
    toType(el) == "function" || toType(el) == "asyncfunction";

export const isFuncArr = (els: any | any[]): boolean => {
    if (!isArr(els)) return false;
    return !(<any[]>els).some((el) => !isFunc(el));
};

export const isGt = (el1: any, el2: any): boolean =>
    isEl(el1) && isEl(el2) && el1 > el2;

export const isGtEq = (el1: any, el2: any): boolean =>
    isEl(el1) && isEl(el2) && el1 >= el2;

export const isIndex = (el: any): boolean =>
    isStr(el) || isNum(el) || isSymbol(el);

export const isLenEq = (len: number, el: any): boolean =>
    isEl(el) && getSize(el) == len;

export const isLenGt = (len: number, el: any): boolean =>
    isEl(el) && getSize(el) > len;

export const isLenGtEq = (len: number, el: any): boolean =>
    isEl(el) && getSize(el) >= len;

export const isLenLt = (len: number, el: any): boolean =>
    isEl(el) && getSize(el) < len;

export const isLenLtEq = (len: number, el: any): boolean =>
    isEl(el) && getSize(el) <= len;

export const isLenOp = (len: number, el: any, op: string): boolean => {
    let result = false;
    switch (op) {
        case "==":
            result = isLenEq(len, el);
            break;
        case "<=":
            result = isLenLtEq(len, el);
            break;
        case ">=":
            result = isLenGtEq(len, el);
            break;
        case "<":
            result = isLenLt(len, el);
            break;
        case ">":
            result = isLenGt(len, el);
            break;
    }
    return result;
};

export const isLt = (el1: any, el2: any): boolean =>
    isEl(el1) && isEl(el2) && el1 < el2;

export const isLtEq = (el1: any, el2: any): boolean =>
    isEl(el1) && isEl(el2) && el1 <= el2;

export const isNotEmpty = (el: any): boolean => isLenGt(0, el);

export const isNotEmptyArr = (el: any): boolean => isArr(el) && isLenGt(0, el);

export const isNotEmptyObj = (el: any): boolean => isObj(el) && isLenGt(0, el);

export const isNotEmptyStr = (el: any): boolean => isStr(el) && isLenGt(0, el);

export const isNull = (el: any): boolean => toType(el) == "null";

export const isNullish = (el: any): boolean => isNull(el) || isUndefined(el);

export const isNum = (el: any): boolean => toType(el) == "number";

export const isNumArr = (els: any | any[]): boolean => {
    if (!isArr(els)) return false;
    return !(<any[]>els).some((el) => !isNum(el));
};

export const isObj = (el: any): boolean => toType(el) == "object";

export const isObjArr = (els: any | any[]): boolean => {
    if (!isArr(els)) return false;
    return !(<any[]>els).some((el) => !isObj(el));
};

export const isObjEq = (
    obj1: Indexable,
    obj2: Indexable,
    keys: string[] = Object.keys({ ...obj1, ...obj2 }),
    strict: boolean = true
): boolean => {
    let result = true;
    keys.forEach((key: Index) => {
        result =
            result &&
            hasKey(obj1, key) &&
            hasKey(obj2, key) &&
            (strict ? obj1[key] === obj2[key] : obj1[key] == obj2[key]);
    });
    return result;
};

export const isOp = (el1: any, el2: any, op: string): boolean => {
    let result = false;
    switch (op) {
        case "==":
            result = isEq(el1, el2);
            break;
        case "<=":
            result = isLtEq(el1, el2);
            break;
        case ">=":
            result = isGtEq(el1, el2);
            break;
        case "<":
            result = isLt(el1, el2);
            break;
        case ">":
            result = isGt(el1, el2);
            break;
    }
    return result;
};

export const isRegex = (el: any): boolean => toType(el) == "regexp";

export const isRegexArr = (els: any | any[]): boolean => {
    if (!isArr(els)) return false;
    return !(<any[]>els).some((el) => !isRegex(el));
};

export const isStr = (el: any): boolean => toType(el) == "string";

export const isStrArr = (els: any | any[]): boolean => {
    if (!isArr(els)) return false;
    return !(<any[]>els).some((el) => !isStr(el));
};

export const isStrLenEq = (len: number, el: any): boolean =>
    isStr(el) && getSize(el) == len;

export const isStrLenGt = (len: number, el: any): boolean =>
    isStr(el) && getSize(el) > len;

export const isStrLenGtEq = (len: number, el: any): boolean =>
    isStr(el) && getSize(el) >= len;

export const isStrLenLt = (len: number, el: any): boolean =>
    isStr(el) && getSize(el) < len;

export const isStrLenLtEq = (len: number, el: any): boolean =>
    isStr(el) && getSize(el) <= len;

export const isStrLenOp = (len: number, el: any, op: string): boolean => {
    let result = false;
    switch (op) {
        case "==":
            result = isStrLenEq(len, el);
            break;
        case "<=":
            result = isStrLenLtEq(len, el);
            break;
        case ">=":
            result = isStrLenGtEq(len, el);
            break;
        case "<":
            result = isStrLenLt(len, el);
            break;
        case ">":
            result = isStrLenGt(len, el);
            break;
    }
    return result;
};

export const isSymbol = (el: any): boolean => toType(el) == "symbol";

export const isType = (type: string, el: any): boolean => toType(el) == type;

export const isUndefined = (el: any): boolean => toType(el) == "undefined";

export const isUndefinedArr = (els: any | any[]): boolean => {
    if (!isArr(els)) return false;
    return !(<any[]>els).some((el) => !isUndefined(el));
};

export const isUrl = (el: any): boolean =>
    el && el != null && /https?:\/\//.test(el);

export const isUrlArr = (els: any | any[]): boolean => {
    if (!isArr(els)) return false;
    return !(<any[]>els).some((el) => !isUrl(el));
};

export const last = (arr: any[]) => {
    if (!isArr(arr) || isEmpty(arr)) return;
    return arr[arr.length - 1];
};

export const lead = (
    num: string | number,
    size = 2,
    locales: string | string[] = "en-US"
): string => numberFormat(Number(num), { minimumIntegerDigits: size }, locales);

export const listFormat = (
    list: Iterable<string>,
    options: Intl.ListFormatOptions,
    locales: string | string[] = "en-US"
): string => {
    const formatter = new Intl.ListFormat(locales, options);
    return formatter.format(list);
};

export const max = (...nums: number[]) => Math.max(...nums);

export const mergeArrs = (
    arr1: any[],
    arr2: any[],
    comp: (el1: any, el2: any) => boolean,
    action: (el1: any, el2: any) => any,
    cleaner: ((el: any[]) => any[]) | null = null,
    strict: boolean = true
): any[] => {
    const A: any[] = [...arr1];
    const B: any[] = [...arr2];
    const pureIntersec: any[] = [];
    const intersec: any[] = [];
    let result: any[] = [];
    arr1.forEach((el1: any, i1: number) => {
        arr2.forEach((el2: any, i2: number) => {
            if (
                comp(el1, el2) &&
                (!strict ||
                    (strict && !pureIntersec.some(comp.bind(null, el1))))
            ) {
                pureIntersec.push(el2);
                intersec.push(action(el1, el2));
                delete A[i1];
                delete B[i2];
            }
        });
    });
    result.push(...A, ...B, ...intersec);
    result = isFunc(cleaner) ? cleaner!(result) : result;
    return result;
};

export const mergeKey = (
    obj: Indexable,
    key: Index,
    altKeys: Index | Index[] = [],
    action?: (el1: any, el2: any) => any
) => {
    if (!isObj(obj) || !isIndex(key)) return;
    altKeys = toArr(altKeys).filter(Boolean);
    const allKeys = [key, ...altKeys];
    if (!hasAnyOfKeys(obj, allKeys)) return;
    let result: any;
    Object.keys(obj)
        .filter((key) => allKeys.includes(key))
        .forEach((key, i) => {
            result =
                i > 0 && isFunc(action) ? action!(result, obj[key]) : obj[key];
            delete obj[key];
        });
    obj[key] = result;
};

// Merge key => arr pairs
export const mergeKeyArr = (
    obj: Indexable,
    key: Index,
    altKeys: Index | Index[] = []
) => {
    if (!isObj(obj) || !isIndex(key)) return;
    altKeys = toArr(altKeys).filter(Boolean);
    if (!hasAnyOfKeys(obj, [key, ...altKeys])) return;
    altKeys.forEach((altKey) => {
        obj[key] = [...toArr(obj[key] ?? []), ...toArr(obj[altKey] ?? [])];
        delete obj[altKey];
    });
};

// Merge key => obj pairs
export const mergeKeyObj = (
    obj: Indexable,
    key: Index,
    altKeys: Index | Index[] = []
) => {
    if (!isObj(obj) || !isIndex(key)) return;
    altKeys = toArr(altKeys).filter(Boolean);
    if (!hasAnyOfKeys(obj, [key, ...altKeys])) return;
    altKeys.forEach((altKey) => {
        obj[key] = {
            ...(obj[key] ?? {}),
            ...(obj[altKey] ?? {}),
        };
        delete obj[altKey];
    });
};

export const mergeObjs = (
    obj1: Indexable,
    obj2: Indexable,
    comp: (el1: [Index, any], el2: [Index, any]) => boolean,
    action: (el1: [Index, any], el2: [Index, any]) => any,
    cleaner: ((el: [Index, any][]) => any[]) | null = null,
    strict: boolean = true
): Indexable => {
    const result: Indexable = {};
    const arrays = mergeArrs(
        Object.entries(obj1),
        Object.entries(obj2),
        comp,
        action,
        cleaner,
        strict
    );
    arrays.forEach((el) => {
        result[el[0]] = el[1];
    });
    return result;
};

export const min = (...nums: number[]) => Math.min(...nums);

export const noop = (...args: any[]) => {};

export const nowInM = () => Math.floor(nowInS() / 60);

export const nowInMs = () => Date.now();

export const nowInS = () => Math.floor(nowInMs() / 1000);

export const numberFormat = (
    num: number | bigint,
    options: Intl.NumberFormatOptions,
    locales: string | string[] = "en-US"
): string => {
    const formatter = new Intl.NumberFormat(locales, options);
    return formatter.format(num);
};

export const omit = (obj: Indexable, omitKeys: string | string[]) =>
    Object.keys(obj)
        .filter((key: Index) => !toArr(omitKeys).includes(key))
        .reduce((result, key: Index) => ({ ...result, [key]: obj[key] }), {});

export const pluralRules = (
    num: number,
    options: Intl.PluralRulesOptions,
    locales: string | string[] = "en-US"
): string => {
    const display = new Intl.PluralRules(locales, options);
    return display.select(num);
};

export const readDir = (
    dirName: string | string[],
    filter = (file: string) => file.endsWith(".js")
) => {
    const dirPath = path.join(...getDirName(dirName));
    const dirFiles = readdirSync(dirPath).filter(filter);
    return dirFiles;
};

export const relativeTimeFormat = (
    num: number,
    unit: Intl.RelativeTimeFormatUnit,
    options: Intl.DateTimeFormatOptions,
    locales: string | string[] = "en-US"
): string => {
    const formatter = new Intl.RelativeTimeFormat(locales, options);
    return formatter.format(num, unit);
};

export const runDir = (
    dirName: string | string[],
    callback: (fileExports: Indexable, fileName: string) => any,
    filter = (file: string) => file.endsWith(".js")
) => {
    for (const fileName of readDir(dirName, filter)) {
        const filePath = path.join(...getDirName(dirName), fileName);
        const fileExports = require(filePath);
        callback(fileExports, fileName);
    }
};

export const segmenter = (
    str: string,
    options: Intl.SegmenterOptions,
    locales: string | string[] = "en-US"
): Intl.SegmentData[] => {
    const segmenter = new Intl.Segmenter(locales, options);
    const segments = segmenter.segment(str);
    return Array.from(segments);
};

export const shuffleArr = (array: any[]): any[] => {
    let currentIndex: number = array.length,
        randomIndex: number;
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }
    return array;
};

/**
 * Converts characters in a string to their simplest form, which is lowercase without diacritics
 * @param {string} str - The string of characters to be converted
 */
export const simplify = (str: string) =>
    str
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");

export const sleep = (ms: number = 1000): Promise<number> =>
    new Promise((resolve) => setTimeout(resolve, ms));

export const sort = (arr: any[], key?: any) => {
    const col = collator(
        {
            numeric: true,
            sensitivity: "base",
        },
        undefined
    );
    arr.sort((a, b) => col(a?.[key] ?? a, b?.[key] ?? b));
};

export const sortKeyNums = (
    objs: Indexable[],
    key: Index,
    order: string = "asc"
): void => {
    if (isArr(objs))
        objs.sort((a: Indexable, b: Indexable) =>
            order == "asc"
                ? getKeyNum(a, key) - getKeyNum(b, key)
                : getKeyNum(b, key) - getKeyNum(a, key)
        );
};

export const strHasVal = (el: string, val: any): boolean =>
    isStr(el) && el.includes(val);

export const toArr = (el: any): any[] => (isArr(el) ? el : [el]);

export const toNum = (el: any): number => {
    el = Number(el);
    return Number.isNaN(el) ? 0 : el;
};

export const toStr = (el: any) => {
    if (isObj(el) || isArr(el)) {
        el = JSON.stringify(el);
    } else if (isNum(el) || isBool(el)) {
        el = el.toString();
    } else if (isRegex(el)) {
        el = el.source;
    } else {
        el = String(el);
    }
    return el;
};

// Function taken from:
// https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
export const toType = (obj: any): string =>
    ({}.toString
        .call(obj)
        .match(/\s([a-zA-Z]+)/)![1]
        .toLowerCase());

export const toUpFirst = (str: string): UpFirstString =>
    `${<Uppercase<string>>str.charAt(0).toUpperCase()}${str.slice(1)}`;

export const trail = (
    num: string | number,
    size = 2,
    locales: string | string[] = "en-US"
): string =>
    numberFormat(Number(num), { minimumFractionDigits: size }, locales);

// Function taken from:
// https://stackoverflow.com/questions/26156292/trim-specific-character-from-a-string
export const trim = (str: string, chars: string): string => {
    chars = chars.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    return str.replace(
        new RegExp("^[" + chars + "]+|[" + chars + "]+$", "g"),
        ""
    );
};

export const uniq = (...els: any[]) => Array.from(new Set(els));

export const zeroWidthSpace: ZeroWidthSpace = "\u200B";

export const zwsp = zeroWidthSpace;
