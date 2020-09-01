import { ListItem, ListItemText } from "@material-ui/core";
import React from "react";
import FieldRenderer, { FieldRendererComponent, ISearchboxFieldData } from "../FieldRenderer";

type AutocompleteListEntry_Props_t<T, D extends ISearchboxFieldData<T>> = {
    readonly value: D,
    readonly viewComponent: FieldRendererComponent<T, {}>;
    readonly onSelect: () => void,
};

export default function AutocompleteListEntry<T, D extends ISearchboxFieldData<T>>(props: AutocompleteListEntry_Props_t<T, D>) {
    return <ListItem button={true} onClick={() => props.onSelect()}>
        <ListItemText>
            <FieldRenderer data={props.value} component={props.viewComponent} componentProps={{}} />
        </ListItemText>
    </ListItem>;
}
