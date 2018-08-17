import { Button, MenuItem, Select, WithStyles, withStyles } from "@material-ui/core";
import classNames from "classnames";
import { ChangeEvent, createElement as __, ReactElement } from "react";
import * as _ from "react-dom-factories";
import { ColumnSet_t } from "..";

type ColumnSetManager_Props_t = {
    columnSets: ColumnSet_t[],
    currentSet: string | null,
    currentColumns: string[],
    onSelect: (set: ColumnSet_t | null) => void,
    onCreate: (set: ColumnSet_t) => void,
    onDelete: (set: ColumnSet_t) => void,
} & WithStyles<"root" | "select" | "actions" | "button">;

function ColumnSetManager(props: ColumnSetManager_Props_t) {
    const selectedSet = props.columnSets.find(set => set.id === props.currentSet);

    let selectedValue = "";
    let isModified = false;
    if (selectedSet) {
        isModified = props.currentColumns.length !== selectedSet.columns.length || selectedSet.columns.some((setColumn, i) => setColumn !== props.currentColumns[i]);
        selectedValue = selectedSet.id;
    }

    const noneItem = __(MenuItem, { value: "", key: "None", disabled: true }, "(None)");
    const columnSetItems = props.columnSets.map((set, i) => __(MenuItem, { key: i, value: set.id }, set.label));
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
            }, "Save"),
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
            }, "Save as new..."),
            __(Button, {
                className: classNames(props.classes.button),
                variant: "outlined",
                color: "primary",
                onClick: () => {
                    props.onDelete(selectedSet!);
                },
                disabled: !selectedSet || selectedSet.readonly,
            }, "Delete"),
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
