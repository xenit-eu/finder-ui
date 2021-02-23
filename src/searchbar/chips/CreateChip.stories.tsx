import { action } from "@storybook/addon-actions";
import React, { useState } from "react";
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

function InteractiveChip() {
    const [isEditing, setEditing] = useState(false);
    const [value, setValue] = useState("");
    return <CreateChip
        editing={isEditing}
        onBeginEditing={() => setEditing(true)}
        onCommitEditing={() => setEditing(false)}
        onCancelEditing={() => {
            setEditing(false);
            setValue("");
        }}
        onChange={setValue}
        value={value}
    />;
}

export const interactive = () => <InteractiveChip />;

interactive.parameters = {
    storyshots: {
        disable: true,
    },
};
