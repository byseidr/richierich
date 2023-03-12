import { Index, Indexable } from "./types";

export const addChild = (
    parents: string[] | string,
    data: any
): { [key: Index]: any } => {
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

export const collator = (
    options: Intl.CollatorOptions,
    locales: string | string[] = "en-US"
): ((x: string, y: string) => number) => {
    const collator = new Intl.Collator(locales, options);
    return collator.compare;
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

export const get = (
    path: string,
    obj: { [key: Index]: any },
    defaultVal: any = undefined
): any => {
    const travel = (regexp: RegExp) =>
        String.prototype.split
            .call(path, regexp)
            .filter(Boolean)
            .reduce(
                (res: { [key: Index]: any }, key: Index) =>
                    res !== null && res !== undefined ? res[key] : res,
                obj
            );
    const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
    return result === undefined || result === obj ? defaultVal : result;
};

export const getArr = (el: any, defaultVal: any = []): any[] =>
    isArr(el) ? el : defaultVal;

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
    defaultVal: any = []
): any[] => (hasKeyArr(el, key) ? (<Indexable>el)[<Index>key] : defaultVal);

export const getKeyBool = (
    el?: Indexable | null,
    key?: Index | null,
    defaultVal: any = false
): boolean => (hasKeyBool(el, key) ? (<Indexable>el)[<Index>key] : defaultVal);

export const getKeyClone = (
    el: Indexable,
    key: Index,
    defaultVal: undefined
): { [key: Index]: any } =>
    (el[key] && { [key]: el[key] }) ||
    (defaultVal && {
        [key]: defaultVal,
    });

export const getKeyFalse = (
    el?: Indexable | null,
    key?: Index | null,
    defaultVal: any = false
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
    defaultVal: any = 0
): number => (hasKeyNum(el, key) ? (<Indexable>el)[<Index>key] : defaultVal);

export const getKeyObj = (
    el?: Indexable | null,
    key?: Index | null,
    defaultVal: any = {}
): { [key: Index]: any } =>
    hasKeyObj(el, key) ? (<Indexable>el)[<Index>key] : defaultVal;

export const getKeyRegex = (
    el?: Indexable | null,
    key?: Index | null,
    defaultVal: any = null
): RegExp => (hasKeyRegex(el, key) ? (<Indexable>el)[<Index>key] : defaultVal);

export const getKeyStr = (
    el?: Indexable | null,
    key?: Index | null,
    prefix: string = "",
    suffix: string = "",
    defaultVal: any = ""
): string =>
    hasKeyStr(el, key)
        ? `${prefix}${(<Indexable>el)[<Index>key]}${suffix}`
        : defaultVal;

export const getKeyTrue = (
    el?: Indexable | null,
    key?: Index | null,
    defaultVal: any = true
): true => (hasKeyTrue(el, key) ? (<Indexable>el)[<Index>key] : defaultVal);

export const getKeyTruthy = (
    el?: Indexable | null,
    key?: Index | null,
    defaultVal: any = true
): true => (hasKeyTruthy(el, key) ? (<Indexable>el)[<Index>key] : defaultVal);

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

export const has = (el: any[], key: number): boolean =>
    isArr(el) && el.includes(key);

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
    obj1: { [key: Index]: any },
    obj2: { [key: Index]: any },
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

export const lead = (
    num: string | number,
    size = 1,
    locales: string | string[] = "en-US"
): string =>
    numberFormat(
        Number(num),
        {
            minimumIntegerDigits: num.toString().length + size,
        },
        locales
    );

export const listFormat = (
    list: Iterable<string>,
    options: Intl.ListFormatOptions,
    locales: string | string[] = "en-US"
): string => {
    const formatter = new Intl.ListFormat(locales, options);
    return formatter.format(list);
};

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

export const omit = (obj: { [key: Index]: any }, omitKeys: string | string[]) =>
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

export const relativeTimeFormat = (
    num: number,
    unit: Intl.RelativeTimeFormatUnit,
    options: Intl.DateTimeFormatOptions,
    locales: string | string[] = "en-US"
): string => {
    const formatter = new Intl.RelativeTimeFormat(locales, options);
    return formatter.format(num, unit);
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

export const sleep = (ms: number = 1000): Promise<number> =>
    new Promise((resolve) => setTimeout(resolve, ms));

export const sort = (arr: any[], key?: any) => {
    var collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: "base",
    });
    arr.sort((a, b) => collator.compare(a?.[key] ?? a, b?.[key] ?? b));
};

export const sortKeyNums = (
    objs: { [key: Index]: any }[],
    key: Index,
    order: string = "asc"
): void => {
    if (isArr(objs))
        objs.sort((a: { [key: Index]: any }, b: { [key: Index]: any }) =>
            order == "asc"
                ? getKeyNum(a, key) - getKeyNum(b, key)
                : getKeyNum(b, key) - getKeyNum(a, key)
        );
};

export const strHasVal = (el: string, val: any): boolean =>
    isStr(el) && el.includes(val);

export const toArr = (el: any): any[] => (isArr(el) ? el : [el]);

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

export const toUpFirst = (str: string): string =>
    str.charAt(0).toUpperCase() + str.slice(1);

export const trail = (
    num: string | number,
    size = 1,
    locales: string | string[] = "en-US"
): string =>
    numberFormat(
        Number(num),
        {
            minimumFractionDigits: num.toString().length + size,
        },
        locales
    );
