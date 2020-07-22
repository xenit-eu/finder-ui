import { action } from "@storybook/addon-actions";
import React, {  } from "react";
import Filter from "./Filter";

export default {
    title: "filters/Filter",
    component: Filter,
};

export const normal = () => <Filter
    title="Field abc"
    open={false}
    onValueClick={action("onValueClick")}
    onOpenChange={action("onOpenChange")}
    values={[
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
]}/>;

export const expanded = () => <Filter
    title="Field abc"
    onValueClick={action("onValueClick")}
    onOpenChange={action("onOpenChange")}
    open={true}
    values={[
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
]}/>;

function explodeText(text: string): string {
    return new Array(15).fill(text).join(" ");
}

export const withLongText = () => <Filter
    title={explodeText("Field abc")}
    onValueClick={action("onValueClick")}
    onOpenChange={action("onOpenChange")}
    open={false}
    values={[
    {
        title: explodeText("value1"),
        count: 1999,
        selected: true,
    },
    {
        title: explodeText("value2"),
        count: 4555,
        selected: false,
    },
]}/>;

export const withLongTextExpanded = () => <Filter
    title={explodeText("Field abc")}
    onValueClick={action("onValueClick")}
    onOpenChange={action("onOpenChange")}
    open={true}
    values={[
    {
        title: explodeText("value1"),
        count: 1999,
        selected: true,
    },
    {
        title: explodeText("value2"),
        count: 4555,
        selected: false,
    },
]}/>;

export const withMultipleSelected = () => <Filter
    title="Field abc"
    onValueClick={action("onValueClick")}
    onOpenChange={action("onOpenChange")}
    open={false}
    values={[
        {
            title: "value1",
            count: 123,
            selected: true,
        },

        {
            title: "value4",
            count: 18,
            selected: true,
        },
        {
            title: "value0",
            count: 1,
            selected: false,
        },
        {
            title: "value2",
            count: 12,
            selected: false,
        },
        {
            title: "value5",
            count: 500,
            selected: false,
        },
        {
            title: "value2",
            count: 12,
            selected: true,
        },
        {
            title: "value9",
            count: 698,
            selected: false,
        },
    ]} />;
