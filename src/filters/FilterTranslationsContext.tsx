import React from "react";
import { IFilter, IFilterValue } from "./types";

export type FilterTranslator<Filter extends IFilter<FilterValue>, FilterValue extends IFilterValue> = {
    translateFilterName: (filter: Filter) => string,
    translateFilterValue: (value: FilterValue) => string,
};

const FilterTranslationsContext = React.createContext<FilterTranslator<IFilter<IFilterValue>, IFilterValue>>({
    translateFilterName: (filter) => filter.title,
    translateFilterValue: (filterValue) => filterValue.title,
});
FilterTranslationsContext.displayName = "FilterTranslationsContext";

export default FilterTranslationsContext;
