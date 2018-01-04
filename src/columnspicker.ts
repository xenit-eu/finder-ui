import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import FontIcon from "material-ui/FontIcon";
import IconButton from "material-ui/IconButton";
import { Component, createElement as __, CSSProperties, DOM as _ } from "react";

import MenuItem from "material-ui/MenuItem";
import SelectField from "material-ui/SelectField";

declare var require: any;
// tslint:disable-next-line:no-var-requires
const Sortable: any = require("react-sortablejs");

import "./columnspicker.less";

export type Column_t = {
    name: string,
    label: string,
    fixed?: boolean,
};

export type ColumnsPicker_t = {
    visible: boolean,
    allColumns: Column_t[],
    selectedColumns: string[], // list of names
    sets?: ColumnSet_t[],
    onSetsChange?: (sets: ColumnSet_t[]) => void,
    onDone: (selectedColumns: string[]) => void,
};

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
            selected: <Column_t[]>props.selectedColumns.map(name => props.allColumns.find(c => c.name === name)).filter(col => !!col),
            sets: (props.sets || JSON.parse(localStorage.getItem(storageKey) || "[]")).map((set: ColumnSet_t) => ({ id: "auto-"+set.label, ...set })),
            selectedSet: "",
        };
    }

    public componentWillReceiveProps(props: ColumnsPicker_t) {
        this.setState({
            selected: <Column_t[]>props.selectedColumns.map(name => props.allColumns.find(c => c.name === name)).filter(col => !!col),
            sets: (props.sets || JSON.parse(localStorage.getItem(storageKey) || "[]")).map((set: ColumnSet_t) => ({ id: "auto-"+set.label, ...set })),
        } as State_t);
    }

    private handleSetChange() {
        if(this.props.onSetsChange) {
            this.props.onSetsChange(this.state.sets);
        } else {
            localStorage.setItem(storageKey, JSON.stringify(this.state.sets));
        }
    }

    private handleDone () {
        this.props.onDone(this.state.selected.map(col => col.name));
        this.setState({ opened: false} as State_t);
    }

    private handleShowDialog () {
        this.setState({opened: true} as State_t);
    }

    private handleSave () {
        this.setState((prevState: State_t) => {
            let set = prevState.sets.find(s => s.id === prevState.selectedSet); // Extract currently selected set
            if (set && !set.readonly) {
                let newSet = { ...set, columns: prevState.selected.map(l => l.name) }; // Place new columns
                let sets = prevState.sets.map(s => s.id === prevState.selectedSet ? newSet : s); // Replace set with new set, keeping its position
                return { sets }; // Update state
            }
            return { sets: prevState.sets };
        }, () => this.handleSetChange());
    }

    private handleSaveAsNew () {
        const name: string = prompt("Column set name") || "DEFAULT";
        this.setState((prevState) => {
            return {
                sets: prevState.sets.concat([{ id: "user-" + name, label: name, columns: prevState.selected.map(l => l.name) }]),
                selectedSet: "user-"+name,
            };
        }, () => this.handleSetChange());
    }

    private _getColumnsIncludingFixed(columns: string[]): Column_t[] {
        const fixedColumns = this.props.allColumns.filter(c => c.fixed).filter(c => columns.indexOf(c.name) === -1);
        return fixedColumns.concat(columns.map(name => <Column_t>this.props.allColumns.find(c => c.name === name)));
    }

    private handleChangeSet (event: any, index: number, value: string) {
        this.setState((prevState) => {
            const set: ColumnSet_t|undefined = prevState.sets.find(s => s.id === value);
            if (set) {
                return {
                    selectedSet: value,
                    selected: this._getColumnsIncludingFixed(set.columns),
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
                selected: this._getColumnsIncludingFixed(selectedSet ? selectedSet.columns : []),
                selectedSet: selectedSet ? selectedSet.id : "",
            };
        }, () => this.handleSetChange());
    }

    private handleChangeTargetSortable(items: string[]) {
        this.setState({ selected: this._getColumnsIncludingFixed(items) });
    }

    private handleChangeSourceSortable(items: string[]) {
        this.setState((prevState: State_t) => ({
            selected: prevState.selected.filter(c => c.fixed || items.indexOf(c.name) === -1),
        }));
    }

    public render() {

        const selected = this.state.selected.map((col) => __("li", {"key": col.name, "data-id": col.name, "className": col.fixed?"column-picker-fixed":""}, col.label));
        const others = this.props.allColumns.filter(a => !this.state.selected.some(b => a.name === b.name)).map((col) => __("li", {"key": col.name, "data-id": col.name}, col.label));

        const sortableOptions = {
            animation: 150,
            sort: true,
            group: {
                name: "clone2",
                pull: <T>(to: T, from: T, element: HTMLElement) => (to === from || !element.classList.contains("column-picker-fixed")),
                put: true,
            },
        };

        const selectedSet = this.state.sets.find(s => s.id === this.state.selectedSet);

        const dialogButtons = [
            __(FlatButton, {
                key: "buttonDone",
                label: "Done",
                primary: true,
                keyboardFocused: false,
                onTouchTap: this.handleDone.bind(this),
                //onClick: this.handleDone.bind(this),
            }),
        ];

        const setsList = this.state.sets.map(o => __(MenuItem, { value: o.id, primaryText: o.label }));

        setsList.unshift(__(MenuItem, { value: "", primaryText: "(None)", disabled: true }));

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
        }, [

            __("h3", {key: "hdr-1"}, "Saved column sets"),

            __(SelectField, {
                key: "sf",
                className: "select-display",
                value: this.state.selectedSet,
                onChange: this.handleChangeSet.bind(this),
            }, setsList),
            _.div({ key: "columns-actions", className: "columns-actions" },
                __(FlatButton, { key: "bs", style: saveButtonStyle, label: "Save", onClick: this.handleSave.bind(this), disabled: !selectedSet || selectedSet.readonly }),
                __(FlatButton, { key: "bsa", style: saveButtonStyle, label: "Save as new...", onClick: this.handleSaveAsNew.bind(this) }),
                __(FlatButton, { key: "bd", style: saveButtonStyle, label: "Delete", onClick: this.handleDelete.bind(this), disabled: !selectedSet||selectedSet.readonly }),
            ),

            __("hr", { key: "hr-1" }),

            __("h3", {key: "hdr-2"}, "Columns to display"),
            __("div", {key: "selected"} ),
                __(Sortable, {
                    options: sortableOptions,
                    className: "block-list-target",
                    onChange: this.handleChangeTargetSortable.bind(this),
                    tag: "ul",
                }, selected),
            __("hr", {key: "hr-2"}),
            __("h3", {key: "hdr-3"}, "Other available columns"),
            __("div", {key: "other", style: {marginBottom: 40}},
                __(Sortable, {
                    options: sortableOptions,
                    className: "block-list-source",
                    onChange: this.handleChangeSourceSortable.bind(this),
                    tag: "ul",
                }, others),
              ),
            __("p", {key: "footer"}, "Drag and drop the name on the above section to display it."),
            ],
        );

        return _.div({ className: "columns-picker" }, [
            this.props.visible ? __(IconButton, {
                key: "button",
                keyboardFocused: false,
                onTouchTap: this.handleShowDialog.bind(this),
                //onClick: this.handleShowDialog.bind(this),
            }, __(FontIcon, {className: "fa fa-gear"})) : undefined,
            dialog,
        ]);

    }
}
