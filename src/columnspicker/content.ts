import { Button, DialogActions, DialogContent, DialogTitle, Theme, Typography, WithStyles, withStyles } from "@material-ui/core";
import { Component, createElement as __, Fragment } from "react";
import { Column_t, ColumnGroup_t, ColumnSet_t, ColumnsPicker_t } from "..";
import AvailableColumns from "./availablecolumns";
import ColumnSetManager from "./columnset";
import SortableColumns from "./sortablecolumns";
import { arrayEquals,deepEqual } from 'finder-utils';

type ColumnsPickerContent_Props_t = {
    selectedColumns: string[], // list of names
    sets: ColumnSet_t[],
    onSetsChange: (sets: ColumnSet_t[]) => void,
    onDone: (selectedColumns: string[]) => void,
    columnGroups: ColumnGroup_t[],
    onDismiss: () => void,
} & WithStyles<"dialogTitle" | "dialogTitleText" | "subheading" | "hintText">;

type ColumnsPickerContent_State_t = {
    selected: string[],
    sets: ColumnSet_t[],
    selectedSet: string | null, // selected ColumnSet id.
};

function getAllColumns(props: ColumnsPickerContent_Props_t): Column_t[] {
    return props.columnGroups.reduce((a, b) => a.concat(...b.columns), [] as Column_t[]);
}

function getDisplayedColumns(props: ColumnsPickerContent_Props_t, columns: string[]): Column_t[] {
    const allColumns = getAllColumns(props);
    const fixedColumns = allColumns.filter(c => c.fixed).filter(c => columns.indexOf(c.name) === -1);
    return fixedColumns.concat(columns.map(name => allColumns.find(col => col.name === name)!).filter(c => !!c));
}

function getSelectedAndSetsState(props: ColumnsPickerContent_Props_t) {
    return {
        selected: getDisplayedColumns(props, props.selectedColumns).map(col => col.name),
        sets: props.sets.map(set => ({
            ...set,
            columns: getDisplayedColumns(props, set.columns).map(col => col.name),
        })),
    };

}

/* @internal */
export class ColumnsPickerContent extends Component<ColumnsPickerContent_Props_t, ColumnsPickerContent_State_t> {
    constructor(props: ColumnsPickerContent_Props_t) {
        super(props);
        this.state = {
            selectedSet: null,
            ...getSelectedAndSetsState(props),
        };
    }

    public componentWillReceiveProps(props: ColumnsPickerContent_Props_t) {
        if (!deepEqual(props.selectedColumns, this.props.selectedColumns) ||
            !deepEqual(props.sets, this.props.sets) ||
            !deepEqual(props.columnGroups, this.props.columnGroups)) {
            this.setState(getSelectedAndSetsState(props));
        }
    }
    private handleDone = () => {
        this.props.onDone(getDisplayedColumns(this.props, this.state.selected).map(col => col.name));
        this.props.onSetsChange(this.state.sets);
        this.props.onDismiss();
    }

    private onSelectColumnSet = (set: ColumnSet_t | null) => {
        if (!set) {
            this.setState({ selectedSet: null });
        } else {
            this.setState({
                selectedSet: set.id,
                selected: set.columns,
            });
        }
    }

    private onCreateColumnSet = (set: ColumnSet_t) => {
        this.setState(state => {
            const existingSet = state.sets.findIndex(s => s.id === set.id);
            if (existingSet === -1) {
                return {
                    selectedSet: set.id,
                    sets: state.sets.concat(set),
                };
            } else {
                return {
                    selectedSet: set.id,
                    sets: [...state.sets.slice(0, existingSet), set, ...state.sets.slice(existingSet + 1)],
                };
            }
        });
    }

    private onDeleteColumnSet = (set: ColumnSet_t) => {
        this.setState(state => ({
            sets: state.sets.filter(s => s.id !== set.id),
            selectedSet: null,
        }));
    }

    private onDeleteColumn = (column: Column_t) => {
        this.setState(s => ({
            selected: s.selected.filter(col => col !== column.name),
        }));
    }
    private onClickColumnCoolDown = { date: Date.now(), col: "none" };
    private canClickColum(columnName: string) {
        return columnName !== this.onClickColumnCoolDown.col || Date.now() > this.onClickColumnCoolDown.date + 1500;
    }
    private updateCoolDownClickColumn(columnName: string) {
        this.onClickColumnCoolDown = { date: Date.now(), col: columnName };
    }
    private onClickColumn = (col: Column_t) => {
        if (!this.canClickColum(col.name)) {
            return;
        }
        this.updateCoolDownClickColumn(col.name);
        this.setState(state => {
            if (state.selected.find(sC => sC === col.name)) {
                return {
                    selected: state.selected.filter(sC => sC !== col.name),
                };
            } else {
                return {
                    selected: state.selected.concat([col.name]),
                };
            }
        });
    }

    private onCancel = () => {
        this.setState(getSelectedAndSetsState(this.props));
        this.props.onDismiss();
    }

    public render() {
        return __(Fragment, {},
            __(DialogTitle, {
                className: this.props.classes!.dialogTitle,
                disableTypography: true,
            }, __(Typography, { className: this.props.classes!.dialogTitleText, variant: "title" }, "Columns to display")),
            __(DialogContent, { className: "columns-picker-content" },
                __(Typography, { variant: "subheading", className: this.props.classes!.subheading }, "Saved column sets"),
                __(ColumnSetManager, {
                    columnSets: this.state.sets,
                    currentSet: this.state.selectedSet,
                    currentColumns: this.state.selected,
                    onSelect: this.onSelectColumnSet,
                    onCreate: this.onCreateColumnSet,
                    onDelete: this.onDeleteColumnSet,
                }),
                __(Typography, { variant: "subheading", className: this.props.classes!.subheading }, "Columns to display"),
                __(SortableColumns, {
                    columns: getDisplayedColumns(this.props, this.state.selected),
                    onDeleteColumn: this.onDeleteColumn,
                    onSortColumns: (columns: Column_t[]) => this.setState({ selected: columns.map(col => col.name) }),
                }),
                __(Typography, { variant: "subheading", className: this.props.classes!.subheading }, "Other available columns"),
                __(AvailableColumns, {
                    availableColumns: this.props.columnGroups,
                    selectedColumns: this.state.selected,
                    onClickColumn: this.onClickColumn,
                }),
                __(Typography, { className: this.props.classes!.hintText }, "Drag and drop the name on the above section to display it."),
            ),
            __(DialogActions, { className: "actions-container" },
                __(Button, {
                    onClick: this.onCancel,
                }, "Cancel"),
                __(Button, {
                    variant: "contained",
                    color: "primary",
                    onClick: this.handleDone,
                }, "Done"),
            ),
        );
    }
}

export default withStyles((theme: Theme) => ({
    dialogTitle: {
        backgroundColor: theme.palette.primary.main,
    },
    dialogTitleText: {
        color: theme.palette.primary.contrastText,
    },
    subheading: {
        marginTop: theme.spacing.unit,
    },
    hintText: {
        marginTop: theme.spacing.unit,
        ...theme.typography.caption,
    },
}), { name: "FinderUIColumnsPicker" })(ColumnsPickerContent);
