export interface IFilterValue {
    readonly title: string;
    readonly count: number;
    readonly selected: boolean;
}

export interface IFilter<T extends IFilterValue> {
    readonly title: string;
    readonly values: readonly T[];
    readonly open: boolean;
}
