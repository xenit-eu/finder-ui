import React from "react";
import Filter from "./Filter";
import { IFilter, IFilterValue } from "./types";

type FilterList_Props_t<T extends IFilter<U>, U extends IFilterValue> = {
    readonly filters: readonly T[],
    readonly onFilterOpenChange: (filter: T, open: boolean) => void,
    readonly onFilterValueClick: (filter: T, filterValue: U) => void,
};

export default function FilterList<T extends IFilter<U>, U extends IFilterValue>(props: FilterList_Props_t<T, U>) {
    return <div>
        {props.filters.map((filter, i) => <Filter
            title={filter.title}
            values={filter.values}
            open={filter.open}
            onOpenChange={(value: boolean) => props.onFilterOpenChange(filter, value)}
            onValueClick={(value: U) => props.onFilterValueClick(filter, value)}
            key={i}
        />)}
    </div>;
}
