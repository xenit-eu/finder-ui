import LabelIcon from "@material-ui/icons/Label";
import MoreVert from "@material-ui/icons/MoreVert";
import { number } from "@storybook/addon-knobs";
import * as React from "react";
import OverflowMenu from "./OverflowMenu";

export default {
    title: "menu/OverflowMenu",
    component: OverflowMenu,
};

export const withoutIcons = () => <OverflowMenu
    items={[
        {
            label: "Item 1",
        },
        {
            label: "Item 2",
        },
        {
            label: "Item 3",
        },
    ]}
    maxItems={number("maxItems", 2)}
    menuIcon={<MoreVert />}
/>;

export const withIcons = () => <OverflowMenu
    items={[
        {
            icon: <LabelIcon />,
            label: "Item 1",
        },
        {
            icon: <LabelIcon />,
            label: "Item 2",
        },
        {
            icon: <LabelIcon />,
            label: "Item 3",
        },
    ]}
    maxItems={number("maxItems", 2)}
    menuIcon={<MoreVert />}
/>;

export const withoutItems = () => <OverflowMenu
    items={[]}
    maxItems={number("maxItems", 2)}
/>;
