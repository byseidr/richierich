export const addChild = (
    parents: string[] | string,
    data: any
): { [key: string]: any } => {
    parents = toArr(parents);
    parents.reverse().forEach((parent: string) => {
        data = { [parent]: data };
    });
    return data;
};

export const arrHasVal = (el: any[], val: any): boolean =>
    isArr(el) && el.includes(val);

export const get = (
    path: string,
    obj: { [key: string]: any },
    defaultVal: any = undefined
): any => {
    const travel = (regexp: RegExp) =>
        String.prototype.split
            .call(path, regexp)
            .filter(Boolean)
            .reduce(
                (res: { [key: string]: any }, key: string) =>
                    res !== null && res !== undefined ? res[key] : res,
                obj
            );
    const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
    return result === undefined || result === obj ? defaultVal : result;
};

export const getArr = (el: any, defaultVal: any = []): any[] =>
    isArr(el) ? el : defaultVal;

export const getFunc = (el: any, args: any[] = []): any =>
    isFunc(el) ? (isEmpty(args) ? el() : el(...args)) : el;

export const getKey = (
    el: { [key: string]: any },
    key: string,
    defaultVal: any = null
): any => (hasKey(el, key) ? el[key] : defaultVal);

export const getKeyArr = (
    el: { [key: string]: any },
    key: string,
    defaultVal: any = []
): any[] => (hasKeyArr(el, key) ? el[key] : defaultVal);

export const getKeyBool = (
    el: { [key: string]: any },
    key: string,
    defaultVal: any = false
): boolean => (hasKeyBool(el, key) ? el[key] : defaultVal);

export const getKeyFalse = (
    el: { [key: string]: any },
    key: string,
    defaultVal: any = false
): false => (hasKeyFalse(el, key) ? el[key] : defaultVal);

export const getKeyFunc = (
    el: { [key: string]: any },
    key: string,
    args: any[] = [],
    defaultVal: any = getKey(el, key)
): any =>
    hasKeyFunc(el, key)
        ? isEmpty(args)
            ? el[key]()
            : el[key](...args)
        : defaultVal;

export const getKeyNum = (
    el: { [key: string]: any },
    key: string,
    defaultVal: any = 0
): number => (hasKeyNum(el, key) ? el[key] : defaultVal);

export const getKeyObj = (
    el: { [key: string]: any },
    key: string,
    defaultVal: any = {}
): { [key: string]: any } => (hasKeyObj(el, key) ? el[key] : defaultVal);

export const getKeyRegex = (
    el: { [key: string]: any },
    key: string,
    defaultVal: any = null
): RegExp => (hasKeyRegex(el, key) ? el[key] : defaultVal);

export const getKeyStr = (
    el: { [key: string]: any },
    key: string,
    prefix: string = "",
    suffix: string = "",
    defaultVal: any = ""
): string => (hasKeyStr(el, key) ? `${prefix}${el[key]}${suffix}` : defaultVal);

export const getKeyTrue = (
    el: { [key: string]: any },
    key: string,
    defaultVal: any = true
): true => (hasKeyTrue(el, key) ? el[key] : defaultVal);

// Function taken from:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
export const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};

export const getSize = (el: any) => {
    if (isObj(el)) {
        el = Object.keys(el).length;
    } else if (isStr(el) || isArr(el)) {
        el = el.length;
    } else if (isRegex(el)) {
        el = 1;
    }
    return el;
};

export const has = (el: any[], key: number): boolean =>
    isArr(el) && el.includes(key);

export const hasKey = (el: { [key: string]: any }, key: string): boolean =>
    isEl(el) &&
    (isArr(el) || isObj(el)) &&
    Object.prototype.hasOwnProperty.call(el, key);

// If el has a key => array pair
export const hasKeyArr = (el: { [key: string]: any }, key: string): boolean =>
    hasKey(el, key) && isArr(el[key]);

// If el has a key => boolean pair
export const hasKeyBool = (el: { [key: string]: any }, key: string): boolean =>
    hasKey(el, key) && isBool(el[key]);

// If el has a key => boolean (false) pair
export const hasKeyFalse = (el: { [key: string]: any }, key: string): boolean =>
    hasKeyFalsy(el, key) && isBool(el[key]);

// If el has a key => boolean (false) pair
export const hasKeyFalsy = (el: { [key: string]: any }, key: string): boolean =>
    hasKey(el, key) && !el[key];

// If el has a key => function pair
export const hasKeyFunc = (el: { [key: string]: any }, key: string): boolean =>
    hasKey(el, key) && isFunc(el[key]);

// If el has a key => number pair
export const hasKeyNum = (el: { [key: string]: any }, key: string): boolean =>
    hasKey(el, key) && isNum(el[key]);

// If el has a key => object pair
export const hasKeyObj = (el: { [key: string]: any }, key: string): boolean =>
    hasKey(el, key) && isObj(el[key]);

// If el has a key => regexp pair
export const hasKeyRegex = (el: { [key: string]: any }, key: string): boolean =>
    hasKey(el, key) && isRegex(el[key]);

// If el has a key => string pair
export const hasKeyStr = (el: { [key: string]: any }, key: string): boolean =>
    hasKey(el, key) && isStr(el[key]);

// If el has a set of specific key => value pairs
export const hasKeysVal = (
    el: { [key: string]: any },
    pairs: any[][]
): boolean => {
    let result: boolean[] = [];
    pairs.forEach((pair) => {
        result.push(hasKeyVal(el, pair[0], pair[1]));
    });
    return !isEmpty(result) && !result.includes(false);
};

// If el has a key => boolean (true) pair
export const hasKeyTrue = (el: { [key: string]: any }, key: string): boolean =>
    hasKeyTruthy(el, key) && isBool(el[key]);

// If el has a key => boolean (true) pair
export const hasKeyTruthy = (
    el: { [key: string]: any },
    key: string
): boolean => hasKey(el, key) && !!el[key];

// If el has a specific key => value pair
export const hasKeyVal = (
    el: { [key: string]: any },
    key: string,
    val: any
): boolean => hasKey(el, key) && el[key] == val;

export const inObj = (obj: { [key: string]: any }, key: string): boolean =>
    Object.prototype.hasOwnProperty.call(obj, key);

export const isArr = (el: any): boolean => Array.isArray(el);

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

export const isBool = (el: any): boolean => toType(el) == "boolean";

export const isEl = (el: any): boolean => el && el != null && !isUndefined(el);

export const isEmpty = (el: any): boolean => !isLenGt(0, el);

export const isEmptyArr = (el: any): boolean => isArr(el) && !isLenGt(0, el);

export const isEmptyObj = (el: any): boolean => isObj(el) && !isLenGt(0, el);

export const isEmptyStr = (el: any): boolean => isStr(el) && !isLenGt(0, el);

export const isEq = (el1: any, el2: any): boolean =>
    isEl(el1) && isEl(el2) && el1 == el2;

export const isFunc = (el: any): boolean =>
    toType(el) == "function" || toType(el) == "asyncfunction";

export const isGt = (el1: any, el2: any): boolean =>
    isEl(el1) && isEl(el2) && el1 > el2;

export const isGtEq = (el1: any, el2: any): boolean =>
    isEl(el1) && isEl(el2) && el1 >= el2;

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

export const isLt = (el1: any, el2: any): boolean =>
    isEl(el1) && isEl(el2) && el1 < el2;

export const isLtEq = (el1: any, el2: any): boolean =>
    isEl(el1) && isEl(el2) && el1 <= el2;

export const isNotEmpty = (el: any): boolean => isLenGt(0, el);

export const isNotEmptyArr = (el: any): boolean => isArr(el) && isLenGt(0, el);

export const isNotEmptyObj = (el: any): boolean => isObj(el) && isLenGt(0, el);

export const isNotEmptyStr = (el: any): boolean => isStr(el) && isLenGt(0, el);

export const isNum = (el: any): boolean => toType(el) == "number";

export const isObj = (el: any): boolean => toType(el) == "object";

export const isObjEq = (
    obj1: { [key: string]: any },
    obj2: { [key: string]: any },
    keys: string[] = ["name"],
    strict: boolean = true
): boolean => {
    let result = true;
    keys.forEach((key: string) => {
        result =
            result &&
            hasKey(obj1, key) &&
            hasKey(obj2, key) &&
            (strict ? obj1[key] === obj2[key] : obj1[key] == obj2[key]);
    });
    return result;
};

export const isRegex = (el: any): boolean => toType(el) == "regexp";

export const isStr = (el: any): boolean => toType(el) == "string";

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

export const isUndefined = (el: any): boolean => toType(el) == "undefined";

export const isURL = (el: any): boolean =>
    el && el != null && el.startsWith("https://");

exports.mergeArrs = (
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

export const nowInM = () => Math.floor(nowInS() / 60);

export const nowInMs = () => Date.now();

export const nowInS = () => Math.floor(nowInMs() / 1000);

export const omit = (obj: { [key: string]: any }, omitKeys: string[]) =>
    Object.keys(obj)
        .filter((key: string) => !toArr(omitKeys).includes(key))
        .reduce((result, key: string) => ({ ...result, [key]: obj[key] }), {});

export const sleep = (ms: number): Promise<number> =>
    new Promise((resolve) => setTimeout(resolve, ms));

export const sortObjsAsc = (
    objs: { [key: string]: any }[],
    key: string
): void => {
    if (isArr(objs))
        objs.sort(
            (a: { [key: string]: any }, b: { [key: string]: any }) =>
                getKeyNum(a, key) - getKeyNum(b, key)
        );
};

export const sortObjsDesc = (
    objs: { [key: string]: any }[],
    key: string
): void => {
    if (isArr(objs))
        objs.sort(
            (a: { [key: string]: any }, b: { [key: string]: any }) =>
                getKeyNum(b, key) - getKeyNum(a, key)
        );
};

export const strHasVal = (el: string, val: any): boolean =>
    isStr(el) && el.includes(val);

export const toArr = (el: any): any[] => (isArr(el) ? el : [el]);

// Function taken from:
// https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
export const toType = (obj: any): string =>
    ({}.toString
        .call(obj)
        .match(/\s([a-zA-Z]+)/)![1]
        .toLowerCase());

export const toUpFirst = (str: string): string =>
    str.charAt(0).toUpperCase() + str.slice(1);
