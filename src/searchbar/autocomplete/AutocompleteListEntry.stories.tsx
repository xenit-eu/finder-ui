import { List } from "@material-ui/core";
import { action } from "@storybook/addon-actions";
import React from "react";
import { SearchboxEmptyFieldValue } from "../FieldRenderer";
import AutocompleteListEntry from "./AutocompleteListEntry";

export default {
    title: "searchbar/autocomplete/AutocompleteListEntry",
    component: AutocompleteListEntry,
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

export const withValue = () => <List>
    <AutocompleteListEntry value={fieldWithValue} viewComponent={viewComponent} onSelect={action("select")} />
</List>;
export const withRange = () => <List>
    <AutocompleteListEntry value={fieldWithRange} viewComponent={viewComponent} onSelect={action("select")} />
</List>;
export const withOpenRange = () => <List>
    <AutocompleteListEntry value={fieldWithOpenRange} viewComponent={viewComponent} onSelect={action("select")} />
</List>;
export const withNoData = () => <List>
    <AutocompleteListEntry value={fieldWithNoData} viewComponent={viewComponent} onSelect={action("select")} />
</List>;

export const withEmptyValue = () => <List>
    <AutocompleteListEntry value={fieldWithEmptyValue} viewComponent={viewComponent} onSelect={action("select")} />
</List>;

export const withEmptyRange = () => <List>
    <AutocompleteListEntry value={fieldWithEmptyRange} viewComponent={viewComponent} onSelect={action("select")} />
</List>;