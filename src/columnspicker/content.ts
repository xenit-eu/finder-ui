import { Button, DialogActions, DialogContent, DialogTitle, StyledComponentProps, Theme, Typography, withStyles } from "@material-ui/core";
import { Component, createElement as __, Fragment } from "react";
import { Column_t, ColumnSet_t, ColumnsPicker_t } from "..";
import AvailableColumns from "./availablecolumns";
import ColumnSetManager from "./columnset";
import SortableColumns from "./sortablecolumns";

type ColumnsPickerContent_Props_t = {
    onDismiss: () => void,
} & ColumnsPicker_t & StyledComponentProps<"dialogTitle" | "dialogTitleText" | "subheading" | "hintText">;

type ColumnsPickerContent_State_t = {
    selected: string[],
    sets: ColumnSet_t[],
    selectedSet: string | null, // selected ColumnSet id.
};
function findColumn(props: ColumnsPicker_t, name: string): Column_t | null {
    if (props.columnGroups) {
        return props.columnGroups.reduce((a, b) => a.concat(...b.columns), [] as Column_t[]).find(col => col.name === name) || null;
    }

    if (props.allColumns) {
        return props.allColumns.find(col => col.name === name) || null;
    }

    return null;
}

class ColumnsPickerContent extends Component<ColumnsPickerContent_Props_t, ColumnsPickerContent_State_t> {
    constructor(props: ColumnsPickerContent_Props_t) {
        super(props);
        this.state = {
            selectedSet: null,
            ...this._getSelectedAndSetsState(props),
        };
    }

    public componentWillReceiveProps(props: ColumnsPickerContent_Props_t) {
        this.setState(this._getSelectedAndSetsState(props));
    }

    private _getSelectedAndSetsState(props: ColumnsPicker_t) {
        return {
            selected: this._getDisplayedColumns(props.selectedColumns).map(col => col.name),
            sets: props.sets.map(set => ({
                ...set,
                columns: this._getDisplayedColumns(set.columns).map(col => col.name),
            })),
        };

    }

    private handleDone() {
        this.props.onDone(this._getDisplayedColumns(this.state.selected).map(col => col.name));
        this.props.onSetsChange(this.state.sets);
        this.props.onDismiss();
    }

    private _getAllColumns(): Column_t[] {
        if (this.props.columnGroups) {
            return this.props.columnGroups.reduce((a, b) => a.concat(...b.columns), [] as Column_t[]);
        }
        if (this.props.allColumns) {
            return this.props.allColumns;
        }
        return [];
    }

    private _getDisplayedColumns(columns: string[]): Column_t[] {
        const fixedColumns = this._getAllColumns().filter(c => c.fixed).filter(c => columns.indexOf(c.name) === -1);
        return fixedColumns.concat(columns.map(name => findColumn(this.props, name)!).filter(c => !!c));
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
                    onSelect: (set: ColumnSet_t | null) => {
                        if (!set) {
                            this.setState({ selectedSet: null });
                        } else {
                            this.setState({
                                selectedSet: set.id,
                                selected: set.columns,
                            });
                        }
                    },
                    onCreate: (set: ColumnSet_t) => {
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
                    },
                    onDelete: (set: ColumnSet_t) => {
                        this.setState(state => ({
                            sets: state.sets.filter(s => s.id !== set.id),
                            selectedSet: null,
                        }));
                    },
                }),
                __(Typography, { variant: "subheading", className: this.props.classes!.subheading }, "Columns to display"),
                __(SortableColumns, {
                    columns: this._getDisplayedColumns(this.state.selected),
                    onDeleteColumn: (column: Column_t) => {
                        this.setState(s => ({
                            selected: s.selected.filter(col => col !== column.name),
                        }));
                    },
                    onSortColumns: (columns: Column_t[]) => this.setState({ selected: columns.map(col => col.name) }),
                }),
                __(Typography, { variant: "subheading", className: this.props.classes!.subheading }, "Other available columns"),
                __(AvailableColumns, {
                    availableColumns: this.props.columnGroups || [{
                        name: "all",
                        label: "All",
                        columns: [this.props.allColumns!],
                    }],
                    selectedColumns: this.state.selected,
                    onClickColumn: (col: Column_t) => {
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
                    },
                }),
                __(Typography, { className: this.props.classes!.hintText }, "Drag and drop the name on the above section to display it."),
            ),
            __(DialogActions, { className: "actions-container" },
                __(Button, {
                    onClick: () => {
                        this.setState({
                            ...this._getSelectedAndSetsState(this.props),
                        });
                        this.props.onDismiss();
                    },
                }, "Cancel"),
                __(Button, {
                    variant: "contained",
                    color: "primary",
                    onClick: this.handleDone.bind(this),
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
}), { name: "FinderUIColumnsPicker" })((props: ColumnsPickerContent_Props_t) => __(ColumnsPickerContent, props));
