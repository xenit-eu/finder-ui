import React, { useCallback } from "react";
import Filter from "./Filter";
import { IFilter, IFilterValue } from "./types";

type FilterList_Props_t<T extends IFilter<U>, U extends IFilterValue> = {
    readonly filters: readonly T[],
    readonly onFilterOpenChange: (filter: T, open: boolean) => void,
    readonly onFilterValueClick: (filter: T, filterValue: U) => void,
};

export default function FilterList<T extends IFilter<U>, U extends IFilterValue>(props: FilterList_Props_t<T, U>) {
    return <div>
        {props.filters.map((filter, i) => <FilterListItem key={i} filter={filter} props={props} />)}
    </div>;
}

function FilterListItem<T extends IFilter<U>, U extends IFilterValue>({ filter, props }: { filter: T, props: FilterList_Props_t<T, U> }) {
    const onOpenChange = useCallback((value: boolean) => props.onFilterOpenChange(filter, value), [filter, props.onFilterOpenChange]);
    const onValueClick = useCallback((value: U) => props.onFilterValueClick(filter, value), [filter, props.onFilterValueClick]);
    return <Filter
            title={filter.title}
            values={filter.values}
            open={filter.open}
            onOpenChange={onOpenChange}
            onValueClick={onValueClick}
        />;

}
