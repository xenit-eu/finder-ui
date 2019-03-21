import { Button, MenuItem, Select, WithStyles, withStyles } from "@material-ui/core";
import classNames from "classnames";
import { ChangeEvent, createElement as __, ReactElement } from "react";
import * as _ from "react-dom-factories";
import { ColumnSet_t } from "..";
import { ENGLISH, FRENCH, DUTCH, WordTranslator } from "../WordTranslator";

type ColumnSetManager_Props_t = {
    columnSets: ColumnSet_t[],
    currentSet: string | null,
    currentColumns: string[],
    onSelect: (set: ColumnSet_t | null) => void,
    onCreate: (set: ColumnSet_t) => void,
    onDelete: (set: ColumnSet_t) => void,
    language: string,

} & WithStyles<"root" | "select" | "actions" | "button">;
const SAVE = "Save";
const SAVE_AS_NEW = "Save as new...";
const DELETE = "Delete";
const translations = {
    [ENGLISH]: {
        [SAVE]: SAVE,
        [SAVE_AS_NEW]: SAVE_AS_NEW,
        [DELETE]: DELETE,
    },
    [FRENCH]: {
        [SAVE]: "Sauvegarder",
        [SAVE_AS_NEW]: "Sauvegarder comme nouveau...",
        [DELETE]: "Supprimer",
    },
    [DUTCH]: {
        [SAVE]: "Opslaan",
        [SAVE_AS_NEW]: "Opslaan als nieuw...",
        [DELETE]: "Verwijderen",
    },

};
function ColumnSetManager(props: ColumnSetManager_Props_t) {
    const translator = new WordTranslator(() => props.language, translations);
    const selectedSet = props.columnSets.find(set => set.id === props.currentSet);

    let selectedValue = "";
    let isModified = false;
    if (selectedSet) {
        isModified = props.currentColumns.length !== selectedSet.columns.length || selectedSet.columns.some((setColumn, i) => setColumn !== props.currentColumns[i]);
        selectedValue = selectedSet.id;
    }

    const noneItem = __(MenuItem, { value: "", key: "None", disabled: true }, "(None)");
    const columnSetItems = props.columnSets.map((set, i) => __(MenuItem, { key: set.id, value: set.id }, set.label));
    let modifiedSetItem = [] as ReactElement<any>[];

    if (selectedSet && isModified) {
        modifiedSetItem = [__(MenuItem, { key: "selectedSetColumnsModified", value: "--mod-" + selectedSet.id }, selectedSet.label + "*")];
        selectedValue = "--mod-" + selectedSet.id;
    }

    const setsList = [noneItem].concat(columnSetItems).concat(modifiedSetItem);

    return _.div({
        className: props.classes.root,
    },
        __(Select, {
            className: classNames("columns-picker-set-select", props.classes.select),
            displayEmpty: true,
            value: selectedValue,
            onChange: (event: ChangeEvent<HTMLSelectElement>) => {
                const value = event.target.value;
                if (value === "") {
                    props.onSelect(null);
                } else {
                    props.onSelect(props.columnSets.find(set => set.id === value)!);
                }
            },
        }, setsList),
        _.div({ key: "columns-actions", className: classNames("columns-picker-set-actions", props.classes.actions) },
            __(Button, {
                className: classNames(props.classes.button),
                variant: "outlined",
                color: "primary",
                onClick: () => {
                    const newSet = {
                        ...selectedSet!,
                        columns: props.currentColumns,
                    };
                    props.onCreate(newSet);
                },
                disabled: !selectedSet || selectedSet.readonly,
            }, translator.translateWord(SAVE)),
            __(Button, {
                className: classNames(props.classes.button),
                variant: "outlined",
                color: "primary",
                onClick: () => {
                    const name: string | null = prompt("Column set name");
                    if (!name) {
                        // No name entered, or cancel clicked -> do not create a new set
                        return;
                    }
                    const newSet = {
                        id: "--user-" + name,
                        label: name,
                        columns: props.currentColumns,
                    };
                    props.onCreate(newSet);
                },
            }, translator.translateWord(SAVE_AS_NEW)),
            __(Button, {
                className: classNames(props.classes.button),
                variant: "outlined",
                color: "primary",
                onClick: () => {
                    props.onDelete(selectedSet!);
                },
                disabled: !selectedSet || selectedSet.readonly,
            }, translator.translateWord(DELETE)),
        ));
}

export default withStyles(theme => ({
    root: {
        display: "flex",
        alignItems: "center",
    },
    select: {
        flex: 0,
        flexGrow: 1,
        marginRight: theme.spacing.unit / 2,
    },
    button: {
        margin: theme.spacing.unit / 2,
    },
}), { name: "FinderUIColumnSetManager" })(ColumnSetManager);
