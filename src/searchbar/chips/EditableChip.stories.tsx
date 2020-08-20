import { action } from "@storybook/addon-actions";
import React from "react";
import EditableChip, { _editing } from "./EditableChip";

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

const editingProp = {
    _editing,
};
function viewComponent({ value }) {
    if (value === null) {
        return "";
    }
    return value.toString();
}

function editComponent({ onChange, value, onKeyUp }) {
    return <input value={value} onChange={(e) => onChange(e.target.value || null)} onKeyUp={onKeyUp} />;
}

const BaseEditableChip = (props) => <EditableChip viewComponent={viewComponent} editComponent={editComponent} {...props} />;

export const plain = () => <BaseEditableChip value={fieldWithValue} />;
export const plainRange = () => <BaseEditableChip value={fieldWithRange} />;
export const withDelete = () => <BaseEditableChip value={fieldWithValue} onDelete={action("delete")} />;
export const withDeleteRange = () => <BaseEditableChip value={fieldWithRange} onDelete={action("delete")} />;
export const withChange = () => <BaseEditableChip value={fieldWithValue} onDelete={action("delete")} onChange={action("change")} />;
export const withChangeRange = () => <BaseEditableChip value={fieldWithRange} onDelete={action("delete")} onChange={action("change")} />;
export const withChangeRangeOpenEnded = () => <BaseEditableChip value={fieldWithOpenRange} onDelete={action("delete")} onChange={action("change")} />;
export const withChangeEditing = () => <BaseEditableChip value={fieldWithValue} onDelete={action("delete")} onChange={action("change")} {...editingProp} />;
export const withChangeEditingRange = () => <BaseEditableChip value={fieldWithRange} onDelete={action("delete")} onChange={action("change")} {...editingProp} />;

export const withChangeEditingRangeOpenEnded = () => <BaseEditableChip value={fieldWithOpenRange} onDelete={action("delete")} onChange={action("change")} {...editingProp} />;
export const withChangeEditingRangeError = () => <BaseEditableChip value={fieldWithNoData} onDelete={action("delete")} onChange={action("change")} {...editingProp} />;
