import { action } from "@storybook/addon-actions";
import React from "react";
import CreateChip, { _editing } from "./CreateChip";
export default {
    title: "searchbar/chips/CreateChip",
    component: CreateChip,
};

export const normal = () => <CreateChip onCreate={action("create")} />;
export const editing = () => <CreateChip onCreate={action("create")} _editing={_editing}/>;
