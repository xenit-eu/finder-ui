import { Chip, List, ListItem, ListItemText } from "@material-ui/core";
import { action } from "@storybook/addon-actions";
import React from "react";
import AutocompleteChips from "./AutocompleteChips";

export default {
    title: "searchbar/autocomplete/AutocompleteChips",
    component: AutocompleteChips,
};

export const normal = () => <div style={{ outline: "1px dotted red" }}>
    <AutocompleteChips>
        <Chip label="Some label" />
        <Chip label="Other label" />
    </AutocompleteChips>
    <List>
        <ListItem>
            <ListItemText primary="Some list item" />
        </ListItem>
        <ListItem>
            <ListItemText primary="Other list item" />
        </ListItem>
    </List>
</div>;

export const fullList = () => <div style={{ outline: "1px dotted red", width: "400px" }}>
    <AutocompleteChips>
        {Array(50).fill(null).map((_, i) => <Chip key={i} label={"Chip " + i} clickable />)}
    </AutocompleteChips>
    <List>
        <ListItem>
            <ListItemText primary="Some list item" />
        </ListItem>
        <ListItem>
            <ListItemText primary="Other list item" />
        </ListItem>
    </List>
</div>;
