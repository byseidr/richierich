export type AllParametersAsUnion<
    T extends { [key: string]: (...args: any) => any }
> = TupleToUnion<Parameters<ValueOf<T>>>;

export type Enumerate<
    N extends number,
    Acc extends number[] = []
> = Acc["length"] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc["length"]]>;

export type Index = string | number | symbol;

export type Indexable = { [key: Index]: any };

export type Range<F extends number, T extends number> =
    | Exclude<Enumerate<T>, Enumerate<F>>
    | T;

export type TupleToUnion<T extends unknown[]> = T[number];

export type ValueOf<T> = T[keyof T];
