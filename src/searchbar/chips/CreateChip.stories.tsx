import { action } from "@storybook/addon-actions";
import React from "react";
import CreateChip from "./CreateChip";
export default {
    title: "searchbar/chips/CreateChip",
    component: CreateChip,
};

const BaseCreateChip = (props) => <CreateChip
    onBeginEditing={action("beginEditing")}
    onCommitEditing={action("commitEditing")}
    onCancelEditing={action("cancelEditing")}
    onChange={action("change")}
    editing={false}
    {...props}
/>;

export const normal = () => <BaseCreateChip />;
export const editing = () => <BaseCreateChip value={"Some value"} editing={true}/>;
