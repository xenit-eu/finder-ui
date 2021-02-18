import { action } from "@storybook/addon-actions";
import React, { useState } from "react";
import TextComponent from "../renderer/Text";
import EditableChip from "./EditableChip";

export default {
    title: "searchbar/chips/EditableChip",
    component: EditableChip,
};

const fieldWithValue = {
    fieldName: "Some field",
    fieldValue: { value: "abc" },
};
const fieldWithRange = {
    fieldName: "Some field",
    fieldValue: { start: "123", end: "888" },
};
const fieldWithOpenRange = {
    fieldName: "Some field",
    fieldValue: { start: "123", end: null },
};

const fieldWithNoData = {
    fieldName: "Some field",
    fieldValue: { start: null, end: null },
};

const BaseEditableChip = (props) => <EditableChip
    viewComponent={TextComponent}
    editComponent={TextComponent}
    onBeginEditing={action("beginEditing")}
    onCommitEditing={action("commitEditing")}
    onCancelEditing={action("cancelEditing")}
    editing={false}
    {...props}
/>;

export const plain = () => <BaseEditableChip value={fieldWithValue} />;
export const plainRange = () => <BaseEditableChip value={fieldWithRange} />;
export const withDelete = () => <BaseEditableChip value={fieldWithValue} onDelete={action("delete")} />;
export const withDeleteRange = () => <BaseEditableChip value={fieldWithRange} onDelete={action("delete")} />;
export const withChange = () => <BaseEditableChip value={fieldWithValue} onDelete={action("delete")} onChange={action("change")} />;
export const withChangeRange = () => <BaseEditableChip value={fieldWithRange} onDelete={action("delete")} onChange={action("change")} />;
export const withChangeRangeOpenEnded = () => <BaseEditableChip value={fieldWithOpenRange} onDelete={action("delete")} onChange={action("change")} />;
export const withChangeEditing = () => <BaseEditableChip value={fieldWithValue} onDelete={action("delete")} onChange={action("change")} editing />;
export const withChangeEditingRange = () => <BaseEditableChip value={fieldWithRange} onDelete={action("delete")} onChange={action("change")} editing />;

export const withChangeEditingRangeOpenEnded = () => <BaseEditableChip value={fieldWithOpenRange} onDelete={action("delete")} onChange={action("change")} editing />;
export const withChangeEditingRangeError = () => <BaseEditableChip value={fieldWithNoData} onDelete={action("delete")} onChange={action("change")} editing />;

function InteractiveChip(props) {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(props.initialValue);
    return <EditableChip
        editing={editing}
        onBeginEditing={() => setEditing(true)}
        onCommitEditing={() => setEditing(false)}
        onCancelEditing={() => {
            setEditing(false);
            setValue(props.initialValue);
        }}
        viewComponent={TextComponent}
        editComponent={TextComponent}
        onChange={setValue}
        onDelete={action("delete")}
        value={value}
        {...props}
    />;
}

export const interactive = () => <div>
    <InteractiveChip initialValue={fieldWithValue} />
    <InteractiveChip initialValue={fieldWithRange} />
    <InteractiveChip initialValue={fieldWithOpenRange} />
    <InteractiveChip initialValue={fieldWithNoData} />
</div>;

interactive.parameters = {
    storyshots: {
        disable: true,
    },
};
