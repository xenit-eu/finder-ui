import { TextField } from "@material-ui/core";
import { action } from "@storybook/addon-actions";
import React from "react";
import CompositeChip from "./CompositeChip";
import EditableChip from "./EditableChip";

export default {
    title: "searchbar/chips/CompositeChip",
    component: CompositeChip,
};

function viewComponent({ value }) {
    if (!value) {
        return "";
    }
    return value.toString();
}
function editComponent({ onChange, value, onKeyUp }) {
    return <TextField value={value} onChange={(e) => onChange(e.target.value || null)} onKeyUp={onKeyUp} />;
}

const SimpleChip = () => <EditableChip
        value={{
            fieldName: "Field",
            fieldValue: { value: "abc" },
        }}
        viewComponent={viewComponent}
        editComponent={editComponent}
        onChange={action("change")}
        onDelete={action("delete")}
    />;

export const Normal = () => <CompositeChip onDelete={action("delete")}>
    <SimpleChip />
    AND
    <SimpleChip />
</CompositeChip>;

export const NestedComposite = () => <CompositeChip onDelete={action("delete")}>
    <Normal />
    OR
    <Normal />
</CompositeChip>;
