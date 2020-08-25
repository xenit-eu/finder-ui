import { ListItem, ListItemText } from "@material-ui/core";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import React from "react";
import { IEditableChipData } from "./chips/EditableChip";

type AutocompleteListEntry_Props_t<T, D extends IEditableChipData<T>> = {
    readonly value: D,
    readonly viewComponent: React.ComponentType<AutocompleteListEntry_ViewComponent_Props_t<T>>;
    readonly onSelect: () => void,
};

export default function AutocompleteListEntry<T, D extends IEditableChipData<T>>(props: AutocompleteListEntry_Props_t<T, D>) {
    const isRange = props.value.fieldValue.value === undefined;
    return <ListItem button={true} onClick={() => props.onSelect()}>
        <ListItemText>
            <em>{props.value.fieldName}:</em>
            {isRange ? <>
                <props.viewComponent value={props.value.fieldValue.start!} />
                <ArrowRightAltIcon fontSize="inherit" />
                <props.viewComponent value={props.value.fieldValue.end!} />
            </> :
                <props.viewComponent value={props.value.fieldValue.value!} />
            }
        </ListItemText>
    </ListItem>;
}

type AutocompleteListEntry_ViewComponent_Props_t<T> = {
    value: T | null,
};
