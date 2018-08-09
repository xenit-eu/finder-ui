import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import FontIcon from "material-ui/FontIcon";
import IconButton from "material-ui/IconButton";
import { Component, createElement as __, CSSProperties, Fragment } from "react";
import * as _ from "react-dom-factories";

import MenuItem from "material-ui/MenuItem";
import SelectField from "material-ui/SelectField";

import { arrayMove, SortableContainer, SortableElement, SortEnd } from "react-sortable-hoc";

import { Chip, Divider, ListSubheader, Paper, StyledComponentProps, withStyles } from "@material-ui/core";
import "./columnspicker.less";

export type Column_t = {
    name: string,
    label: string,
    fixed?: boolean,
};

export type ColumnsPicker_t = {
    visible: boolean,
    selectedColumns: string[], // list of names
    sets?: ColumnSet_t[],
    onSetsChange?: (sets: ColumnSet_t[]) => void,
    onDone: (selectedColumns: string[]) => void,
} & ({
    allColumns?: never,
    columnGroups: ColumnGroup_t[],
} | {
    columnGroups?: never,
    /** @deprecated, use columnGroups instead */
    allColumns: Column_t[],
});

const saveButtonStyle: CSSProperties = {
    position: "relative",
    float: "right",
};

export type ColumnSet_t = {
    id: string,
    label: string,
    readonly?: boolean,
    columns: string[], // list of column names.
};

type State_t = {
    opened: boolean, // open dialog.
    selected: Column_t[],
    sets: ColumnSet_t[],
    selectedSet: string, // selected ColumnSet label.
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
            selected: <Column_t[]>props.selectedColumns.map(name => findColumn(props, name)).filter(col => !!col),
            sets: (props.sets || JSON.parse(localStorage.getItem(storageKey) || "[]")).map((set: ColumnSet_t) => ({ id: "auto-" + set.label, ...set })),
            selectedSet: "",
        };
    }

    public componentWillReceiveProps(props: ColumnsPicker_t) {
        this.setState({
            selected: <Column_t[]>props.selectedColumns.map(name => findColumn(props, name)).filter(col => !!col),
            sets: (props.sets || JSON.parse(localStorage.getItem(storageKey) || "[]")).map((set: ColumnSet_t) => ({ id: "auto-" + set.label, ...set })),
        } as State_t);
    }

    private handleDone() {
        this.props.onDone(this.state.selected.map(col => col.name));

        if (this.props.onSetsChange) {
            this.props.onSetsChange(this.state.sets);
        } else {
            localStorage.setItem(storageKey, JSON.stringify(this.state.sets));
        }
        this.setState({ opened: false } as State_t);
    }

    private handleShowDialog() {
        this.setState({ opened: true } as State_t);
    }

    private handleSave() {
        this.setState((prevState: State_t) => {
            let set = prevState.sets.find(s => s.id === prevState.selectedSet); // Extract currently selected set
            if (set && !set.readonly) {
                let newSet = { ...set, columns: prevState.selected.map(l => l.name) }; // Place new columns
                let sets = prevState.sets.map(s => s.id === prevState.selectedSet ? newSet : s); // Replace set with new set, keeping its position
                return { sets }; // Update state
            }
            return { sets: prevState.sets };
        });
    }

    private handleSaveAsNew() {
        const name: string | null = prompt("Column set name");
        if (!name) {
            // No name entered, or cancel clicked -> do not create a new set
            return;
        }
        this.setState((prevState) => {
            return {
                sets: prevState.sets.concat([{ id: "user-" + name, label: name, columns: prevState.selected.map(l => l.name) }]),
                selectedSet: "user-" + name,
            };
        });
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

    private handleChangeSet(event: any, index: number, value: string) {
        this.setState((prevState) => {
            const set: ColumnSet_t | undefined = prevState.sets.find(s => s.id === value);
            if (set) {
                return {
                    ...prevState,
                    selectedSet: value,
                    selected: this._getDisplayedColumns(set.columns),
                };
            }
            return prevState;
        });
    }

    private handleDelete() {
        this.setState((prevState) => {
            const newSets = prevState.sets.filter(s => s.id !== prevState.selectedSet || s.readonly);
            const selectedSet = newSets.length > 0 ? newSets[0] : null;
            return {
                sets: newSets,
                selected: this._getDisplayedColumns(selectedSet ? selectedSet.columns : []),
                selectedSet: selectedSet ? selectedSet.id : "",
            };
        });
    }

    public render() {

        const selectedSet = this.state.sets.find(s => s.id === this.state.selectedSet);
        const selectedSetColumns = selectedSet ? this._getDisplayedColumns(selectedSet.columns) : [];
        const columnsModified = selectedSet && (this.state.selected.length !== selectedSetColumns.length || !this.state.selected.every((value, i) => value.name === selectedSetColumns[i].name));

        const dialogButtons = [
            __(FlatButton, {
                key: "buttonDone",
                label: "Done",
                primary: true,
                keyboardFocused: false,
                onClick: this.handleDone.bind(this),
            }),
        ];

        const setsList = this.state.sets.map((o, i) => __(MenuItem, { key: i, value: o.id, primaryText: o.label }));

        setsList.unshift(__(MenuItem, { value: "", key: "None", primaryText: "(None)", disabled: true }));

        if (selectedSet && columnsModified) {
            setsList.push(__(MenuItem, { key: "selectedSetColumnsModified", value: "--mod-" + selectedSet.id, primaryText: selectedSet.label + "*" }));
        }

        const dialog = __(Dialog, {
            key: "dialog",
            title: "Columns to display",
            actions: dialogButtons,
            modal: true,
            open: this.state.opened,
            className: "columns-picker-dialog",
            bodyClassName: "columns-picker-content",
            actionsContainerClassName: "actions-container",
            autoScrollBodyContent: true,
        },

            __("h3", { key: "hdr-1" }, "Saved column sets"),
            __(SelectField, {
                key: "sf",
                className: "select-display",
                value: (columnsModified ? "--mod-" : "") + this.state.selectedSet,
                onChange: this.handleChangeSet.bind(this),
            }, setsList),
            _.div({ key: "columns-actions", className: "columns-actions" },
                __(FlatButton, { key: "bs", style: saveButtonStyle, label: "Save", onClick: this.handleSave.bind(this), disabled: !selectedSet || selectedSet.readonly }),
                __(FlatButton, { key: "bsa", style: saveButtonStyle, label: "Save as new...", onClick: this.handleSaveAsNew.bind(this) }),
                __(FlatButton, { key: "bd", style: saveButtonStyle, label: "Delete", onClick: this.handleDelete.bind(this), disabled: !selectedSet || selectedSet.readonly }),
            ),
            __("h3", { key: "hdr-2" }, "Columns to display"),
            __(SortableColumns, {
                key: "selected-columns",
                columns: this.state.selected,
                onDeleteColumn: (column: Column_t) => {
                    this.setState(s => ({
                        selected: s.selected.filter(col => col.name !== column.name),
                    }));
                },
                onSortColumns: (columns: Column_t[]) => this.setState({ selected: columns }),
            }),
            __("h3", { key: "hdr-3" }, "Other available columns"),
            __("div", { key: "other", style: { marginBottom: 40 } },
                __(AvailableColumns, {
                    availableColumns: this.props.columnGroups || [{
                        name: "all",
                        label: "All",
                        columns: [this.props.allColumns!],
                    }],
                    selectedColumns: this.state.selected.map(col => col.name),
                    onClickColumn: (col: Column_t) => {
                        if (this.state.selected.find(sC => sC.name === col.name)) {
                            this.setState({
                                selected: this.state.selected.filter(sC => sC.name !== col.name),
                            });
                        } else {
                            this.setState({
                                selected: this.state.selected.concat([col]),
                            });
                        }
                    },
                }),
            ),
            __("p", { key: "footer" }, "Drag and drop the name on the above section to display it."),
        );

        return _.div({ className: "columns-picker" }, [
            this.props.visible ? __(IconButton, {
                key: "button",
                keyboardFocused: false,
                onClick: this.handleShowDialog.bind(this),
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
