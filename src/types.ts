export type AllParametersAsUnion<
    T extends { [key: string]: (...args: any) => any }
> = TupleToUnion<Parameters<ValueOf<T>>>;

export type Enumerate<
    N extends number,
    Acc extends number[] = []
> = Acc["length"] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc["length"]]>;

export type GenericRange<S extends number, E extends number> =
    | LargeRange<S, E>
    | `${LargeRange<S, E>}`;

export type Index = string | number | symbol;

export type Indexable<T = any> = { [key: Index]: T };

export type JSONValue =
    | string
    | number
    | boolean
    | { [x: string]: JSONValue }
    | Array<JSONValue>;

export type LargeRange<S extends number, E extends number> =
    | Range<S, E>
    | RangeWithLeadingZero<S, E>;

export type Range<F extends number, T extends number> =
    | Exclude<Enumerate<T>, Enumerate<F>>
    | T;

export type RangeWithLeadingZero<
    S extends number,
    E extends number
> = E extends Range<0, 9>
    ? `0${Range<S, E>}`
    : `${`0${Range<S, 9>}` | `${Range<10, E>}`}`;

export type TupleToUnion<T extends unknown[]> = T[number];

export type ValueOf<T> = T[keyof T];
