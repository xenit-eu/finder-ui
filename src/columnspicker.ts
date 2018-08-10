import classNames from "classnames";
import FontIcon from "material-ui/FontIcon";
import IconButton from "material-ui/IconButton";
import { ChangeEvent, Component, createElement as __, Fragment } from "react";
import * as _ from "react-dom-factories";

import { arrayMove, SortableContainer, SortableElement, SortEnd } from "react-sortable-hoc";

import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, ListSubheader, MenuItem, Paper, Select, StyledComponentProps, Typography, withStyles } from "@material-ui/core";
import "./columnspicker.less";

export type Column_t = {
    name: string,
    label: string,
    fixed?: boolean,
};

export type ColumnsPicker_t = {
    visible: boolean,
    selectedColumns: string[], // list of names
    sets: ColumnSet_t[],
    onSetsChange: (sets: ColumnSet_t[]) => void,
    onDone: (selectedColumns: string[]) => void,
} & ({
    allColumns?: never,
    columnGroups: ColumnGroup_t[],
} | {
    columnGroups?: never,
    /** @deprecated, use columnGroups instead */
    allColumns: Column_t[],
});

export type ColumnSet_t = {
    id: string,
    label: string,
    readonly?: boolean,
    columns: string[], // list of column names.
};

type State_t = {
    opened: boolean, // open dialog.
};

const storageKey = "users-column-sets";

function findColumn(props: ColumnsPicker_t, name: string): Column_t | null {
    if (props.columnGroups) {
        return props.columnGroups.reduce((a, b) => a.concat(...b.columns), [] as Column_t[]).find(col => col.name === name) || null;
    }

    if (props.allColumns) {
        return props.allColumns.find(col => col.name === name) || null;
    }

    return null;
}

//@Component ColumnsPicker
//@ComponentDescription "presents a dialog to select the columns to be displayed in the DocList"
//@ComponentDescription "this components allows also to save current column sets for later selection."
//@Method ColumnsPicker Returns ReactComponent
//@MethodDescription "ColumnsPicker({param1: value1, param2: value2, ...})"
//@Param visible boolean "controls the display of the dialog, displays it when put to true"
//@Param allColumns Column_t[] "all possible columns that can be selected"
//@Param selectedColumns string[] "list of selected column names "
//@Param onDone (selectedColumns: string[]) => void "'Done' button pressed on the dialog"

export class ColumnsPicker extends Component<ColumnsPicker_t, State_t> {

    constructor(props: ColumnsPicker_t) {
        super(props);
        this.state = {
            opened: false,
        };
    }
    private handleShowDialog() {
        this.setState({ opened: true } as State_t);
    }

    public render() {
        const dialog = __(Dialog, {
            key: "dialog",
            open: this.state.opened,
            className: "columns-picker-dialog",
            scroll: "paper",
            fullWidth: true,
            onClose: () => this.setState({ opened: false }),
        }, __(ColumnsPickerContent, {
            ...<ColumnsPicker_t>this.props,
            onDismiss: () => this.setState({ opened: false }),
        }));

        return _.div({ className: "columns-picker" }, [
            this.props.visible ? __(IconButton, {
                key: "button",
                keyboardFocused: false,
                onClick: () => this.setState({ opened: true }),
            }, __(FontIcon, { className: "fa fa-gear" })) : undefined,
            dialog,
        ]);

    }
}

export type ColumnGroup_t = {
    name: string,
    label: string,
    columns: Column_t[][],
};

type AvailableColumns_Props_t = {
    availableColumns: ColumnGroup_t[],
    selectedColumns: string[],
    onClickColumn: (col: Column_t) => void,
} & StyledComponentProps<"root" | "header" | "content" | "divider">;

const AvailableColumns = withStyles({
    root: {},
    header: {},
    content: {
        flexShrink: "unset",
    },
    divider: {
        margin: 0,
    },
})((props: AvailableColumns_Props_t) => {
    return _.div({
        className: props.classes!.root,
    }, props.availableColumns.map((grouping, i) => __(Fragment, { key: i }, [
        __(ListSubheader, {
            className: props.classes!.header,
            key: "header",
            component: "div",
            disableSticky: true,
        }, grouping.label),
        _.div({
            className: props.classes!.content,
            key: "content",
        }, grouping.columns.map((columns, j) => __(Fragment,
            { key: j }, [
                j !== 0 ? __(Divider, { key: "divider", className: props.classes!.divider }) : null,
                ...columns.map((column, k) => __(ColumnChip, {
                    key: k,
                    column,
                    onClick: () => props.onClickColumn(column),
                    selectedColumns: props.selectedColumns,
                })),
            ]),
            ),
        ),
    ])));
});

type ColumnChip_Props_t = {
    column: Column_t,
    selectedColumns: string[],
    onClick?: () => void,
    onDelete?: () => void,
} & StyledComponentProps<"root">;

const ColumnChip = withStyles(theme => ({
    root: {
        margin: theme.spacing.unit / 2,
    },
}))((props: ColumnChip_Props_t) => {
    return __(Chip, {
        className: props.classes!.root,
        label: props.column.label,
        onClick: props.column.fixed ? undefined : props.onClick,
        onDelete: props.column.fixed ? undefined : props.onDelete,
        color: props.selectedColumns.indexOf(props.column.name) >= 0 ? "primary" : "default",
    });
});

const SortableColumnChip = SortableElement(({ column, onDelete }: { column: Column_t, onDelete: () => void }) => __(ColumnChip, {
    column,
    selectedColumns: [],
    onDelete,
}));

const SortableColumnsInternal = SortableContainer(({ columns, onDeleteColumn }: { columns: Column_t[], onDeleteColumn: (column: Column_t) => void }) => {
    return __(Paper, {}, columns.map((column, i) => __(SortableColumnChip, { key: i, column, onDelete: () => onDeleteColumn(column), index: i })));
});

type SortableColumns_Props_t = {
    columns: Column_t[],
    onDeleteColumn: (col: Column_t) => void,
    onSortColumns: (col: Column_t[]) => void,
};

function SortableColumns(props: SortableColumns_Props_t) {
    return __(SortableColumnsInternal, {
        axis: "xy",
        columns: props.columns,
        helperClass: "columns-picker-sortable-helper",
        lockToContainerEdges: true,
        distance: 1,
        lockOffset: ["0%", "0%"],
        onSortEnd: ({ oldIndex, newIndex }: SortEnd) => {
            props.onSortColumns(arrayMove(props.columns, oldIndex, newIndex));
        },
        onDeleteColumn: props.onDeleteColumn,
    });
}

type ColumnSetManager_Props_t = {
    columnSets: ColumnSet_t[],
    currentSet: string | null,
    currentColumns: string[],
    onSelect: (set: ColumnSet_t | null) => void,
    onCreate: (set: ColumnSet_t) => void,
    onDelete: (set: ColumnSet_t) => void,
} & StyledComponentProps<"root" | "select" | "actions" | "button">;

const ColumnSetManager = withStyles(theme => ({
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
}), { name: "FinderUIColumnSetManager" })((props: ColumnSetManager_Props_t) => {
    const selectedSet = props.columnSets.find(set => set.id === props.currentSet);

    let selectedValue = "";
    let isModified = false;
    if (selectedSet) {
        isModified = props.currentColumns.length !== selectedSet.columns.length || selectedSet.columns.some((setColumn, i) => setColumn !== props.currentColumns[i]);
        selectedValue = selectedSet.id;
    }

    const setsList = props.columnSets.map((set, i) => __(MenuItem, { key: i, value: set.id }, set.label));

    setsList.unshift(__(MenuItem, { value: "", key: "None", disabled: true }, "(None)"));

    if (selectedSet && isModified) {
        setsList.push(__(MenuItem, { key: "selectedSetColumnsModified", value: "--mod-" + selectedSet.id }, selectedSet.label + "*"));
        selectedValue = "--mod-" + selectedSet.id;
    }

    return _.div({
        className: props.classes!.root,
    },
        __(Select, {
            key: "sf",
            className: classNames("columns-picker-set-select", props.classes!.select),
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
        _.div({ key: "columns-actions", className: classNames("columns-picker-set-actions", props.classes!.actions) },
            __(Button, {
                key: "bs",
                className: classNames(props.classes!.button),
                variant: "outlined",
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
                key: "bsa",
                className: classNames(props.classes!.button),
                variant: "outlined",
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
                key: "bd",
                className: classNames(props.classes!.button),
                variant: "outlined",
                onClick: () => {
                    props.onDelete(selectedSet!);
                },
                disabled: !selectedSet || selectedSet.readonly,
            }, "Delete"),
        ));
});

type ColumnsPickerContent_Props_t = {
    onDismiss: () => void,
} & ColumnsPicker_t;

type ColumnsPickerContent_State_t = {
    selected: string[],
    sets: ColumnSet_t[],
    selectedSet: string | null, // selected ColumnSet id.
};

class ColumnsPickerContent extends Component<ColumnsPickerContent_Props_t, ColumnsPickerContent_State_t> {
    constructor(props: ColumnsPickerContent_Props_t) {
        super(props);
        this.state = {
            selectedSet: "",
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
        return __(Fragment, {}, [
            __(DialogTitle, { key: "title" }, "Columns to display"),
            __(DialogContent, { key: "content", className: "columns-picker-content" },
                __(Typography, { key: "column-sets-title", variant: "subheading" }, "Saved column sets"),
                __(ColumnSetManager, {
                    key: "column-sets",
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
                __(Typography, { key: "selected-columns-title", variant: "subheading" }, "Columns to display"),
                __(SortableColumns, {
                    key: "selected-columns",
                    columns: this._getDisplayedColumns(this.state.selected),
                    onDeleteColumn: (column: Column_t) => {
                        this.setState(s => ({
                            selected: s.selected.filter(col => col !== column.name),
                        }));
                    },
                    onSortColumns: (columns: Column_t[]) => this.setState({ selected: columns.map(col => col.name) }),
                }),
                __(Typography, { key: "other-title", variant: "subheading" }, "Other available columns"),
                __(AvailableColumns, {
                    key: "other-content",
                    availableColumns: this.props.columnGroups || [{
                        name: "all",
                        label: "All",
                        columns: [this.props.allColumns!],
                    }],
                    selectedColumns: this.state.selected,
                    onClickColumn: (col: Column_t) => {
                        if (this.state.selected.find(sC => sC === col.name)) {
                            this.setState({
                                selected: this.state.selected.filter(sC => sC !== col.name),
                            });
                        } else {
                            this.setState({
                                selected: this.state.selected.concat([col.name]),
                            });
                        }
                    },
                }),
                __(Typography, { key: "footer" }, "Drag and drop the name on the above section to display it."),
            ),
            __(DialogActions, { key: "actions", className: "actions-container" }, [
                __(Button, {
                    key: "buttonCancel",
                    onClick: () => {
                        this.setState({
                            ...this._getSelectedAndSetsState(this.props),
                        });
                        this.props.onDismiss();
                    },
                }, "Cancel"),
                __(Button, {
                    key: "buttonDone",
                    variant: "contained",
                    color: "primary",
                    onClick: this.handleDone.bind(this),
                }, "Done"),
            ]),
        ]);
    }
}
