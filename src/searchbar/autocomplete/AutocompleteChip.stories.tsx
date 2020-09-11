import { action } from "@storybook/addon-actions";
import React from "react";
import { SearchboxEmptyFieldValue } from "../FieldRenderer";
import AutocompleteChip from "./AutocompleteChip";

export default {
    title: "searchbar/autocomplete/AutocompleteChip",
    component: AutocompleteChip,
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
const fieldWithEmptyValue = {
    fieldName: "Some field",
    fieldValue: SearchboxEmptyFieldValue.EMPTY_VALUE,
};
const fieldWithEmptyRange = {
    fieldName: "Some field",
    fieldValue: SearchboxEmptyFieldValue.EMPTY_RANGE,
};
function viewComponent({ value }) {
    if (value === null) {
        return <span style={{color: "lightgray", fontStyle: "italic"}}>(Empty)</span>;
    }
    return value.toString();
}

export const withValue = () => <AutocompleteChip value={fieldWithValue} viewComponent={viewComponent} onSelect={action("select")} />;
export const withRange = () => <AutocompleteChip value={fieldWithRange} viewComponent={viewComponent} onSelect={action("select")} />;
export const withOpenRange = () => <AutocompleteChip value={fieldWithOpenRange} viewComponent={viewComponent} onSelect={action("select")} />;
export const withNoData = () => <AutocompleteChip value={fieldWithNoData} viewComponent={viewComponent} onSelect={action("select")} />;
export const withEmptyValue = () => <AutocompleteChip value={fieldWithEmptyValue} viewComponent={viewComponent} onSelect={action("select")} />;
export const withEmptyRange = () => <AutocompleteChip value={fieldWithEmptyRange} viewComponent={viewComponent} onSelect={action("select")} />;
