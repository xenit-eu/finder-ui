import { action } from "@storybook/addon-actions";
import React, { useReducer } from "react";
import FilterList from "./FilterList";

export default {
    title: "filters/FilterList",
    component: FilterList,
};

const filters = [
    {
        title: "Abc",
        open: false,
        values: [
            {
                title: "value1",
                count: 10,
                selected: true,
            },
            {
                title: "value2",
                count: 40,
                selected: false,
            },
        ],
    },
    {
        title: "Def Bla Bla field",
        open: true,
        values: [
            {
                title: "A certain value",
                count: 12,
                selected: false,
            },
            {
                title: "A very other value",
                count: 96,
                selected: false,
            },
        ],
    },

    {
        title: "An other important field with a very long name",
        open: false,
        values: [
            {
                title: "This field value is almost an entire sentence",
                count: 2,
                selected: false,
            },
            {
                title: "This is a short field value, I think",
                count: 105,
                selected: true,
            },
        ],
    },
];
export const normal = () => <FilterList
    filters={filters}
    onFilterValueClick={action("onFilterValueClick")}
    onFilterOpenChange={action("onFilterOpenChange")}
    />;

function FilterListInteractive() {
    const [filterList, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case "toggle":
                return state.map((f) => f === action.filter ? { ...f, open: action.open } : f);
            case "valueClick":
                return state.map((f) => f === action.filter ? {
                    ...f,
                    values: f.values.map((v) => v === action.value ? {
                        ...v,
                        selected: !v.selected,
                    } : v),
                } : f);
            default:
                throw new Error();
        }
    }, filters);

    return <FilterList
        filters={filterList}
        onFilterOpenChange={(filter, openState) => dispatch({ type: "toggle", filter, open: openState })}

        onFilterValueClick={(filter, value) => dispatch({type: "valueClick", filter, value})}
    />;

}

export const interactive = () => <FilterListInteractive />;

interactive.story = {
    parameters: {
        storyshots: { disable: true },
    },
};
