import { action } from "@storybook/addon-actions";
import React from "react";
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

function viewComponent({ value }) {
    return value.toString();
}
function editComponent({ onChange, value, onKeyUp }) {
    return <input value={value} onChange={(e) => onChange(e.target.value)} onKeyUp={onKeyUp} />;
}

const BaseEditableChip = (props) => <EditableChip viewComponent={viewComponent} editComponent={editComponent} {...props} />;

export const plain = () => <BaseEditableChip value={fieldWithValue} />;
export const plainRange = () => <BaseEditableChip value={fieldWithRange} />;
export const withDelete = () => <BaseEditableChip value={fieldWithValue} onDelete={action("delete")} />;
export const withDeleteRange = () => <BaseEditableChip value={fieldWithRange} onDelete={action("delete")} />;
export const withChange = () => <BaseEditableChip value={fieldWithValue} onDelete={action("delete")} onChange={action("change")} />;
export const withChangeRange = () => <BaseEditableChip value={fieldWithRange} onDelete={action("delete")} onChange={action("change")} />;
export const withChangeEditing = () => <BaseEditableChip value={fieldWithValue} onDelete={action("delete")} onChange={action("change")} _editing />;
export const withChangeEditingRange = () => <BaseEditableChip value={fieldWithRange} onDelete={action("delete")} onChange={action("change")} _editing />;
