import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import FontIcon from "material-ui/FontIcon";
import IconButton from "material-ui/IconButton";
import { Component, createElement as __ } from "react";

declare var require: any;
// tslint:disable-next-line:no-var-requires
const Sortable: any = require("react-sortablejs");

import "./columnspicker.less";

export type Column_t = {
    name: string,
    label: string,
    /*alignRight?: boolean,
    sortable?: boolean,
    sortDirection?: SortDirection_t,
    format?: (a: any, props: Row_t) => string,*/
};

export type ColumnsPicker_t = {
    visible: boolean,
    allColumns: Column_t[],
    selectedColumns: string[], // list of names
    onDone: (selectedColumns: string[]) => void,
};

const sortableOptions = {
    animation: 150,
    sort: false,
    group: {
        name: "clone2",
        pull: true,
        put: true,
    },
};

export class ColumnsPicker extends Component<ColumnsPicker_t, any> {

    private mappingByName: {[k: string]: Column_t};
    private mappingByLabel: {[k: string]: Column_t};

    constructor(props: ColumnsPicker_t) {
        super(props);

        this.mappingByName = this.props.allColumns.reduce((map, c) => { map[c.name] = c; return map; }, {});
        this.mappingByLabel = this.props.allColumns.reduce((map, c) => { map[c.label] = c; return map; }, {});

        this.state = {
            opened: false,
            all: this.props.allColumns.filter(a => this.props.selectedColumns.indexOf(a.name) === -1).map(c => c.label),
            selected: this.props.selectedColumns.map(a => this.mappingByName[a].label),
        };
    }

    private handleDone () {
        this.props.onDone(this.state.selected.map((c: string) => this.mappingByLabel[c].name));
        this.setState({opened: false});
    }

    private handleShowDialog () {
        this.setState({opened: true});
    }

    public render() {

        const all = this.state.all.map((val: string, key: string) => __("li", {key, "data-id": val}, val));
        const selected = this.state.selected.map((val: string, key: string) => __("li", {key, "data-id": val}, val));

        const dialogButtons = [
            __(FlatButton, {
                label: "Done",
                primary: true,
                keyboardFocused: false,
                onTouchTap: this.handleDone.bind(this),
                onClick: this.handleDone.bind(this),
            }),
        ];

        const dialog = __(Dialog, {
            title: "Columns to display",
            actions: dialogButtons,
            modal: true,
            open: this.state.opened,
            className: "columns-picker-dialog",
            bodyClassName: "columns-picker-content",
            autoScrollBodyContent: true,
        }, [
            __("h3", {}, "Displayed columns"),
            __("div", {} ),
                __(Sortable, {
                    options: sortableOptions,
                    className: "block-list-target",
                    onChange: (items) => this.setState({ selected: items }),
                    tag: "ul",
                }, selected),
            __("hr"),
            __("h3", {}, "Other available columns"),
            __("div", {style: {marginBottom: 40}},
                __(Sortable, {
                    options: sortableOptions,
                    className: "block-list-source",
                    onChange: (items) => this.setState({ all: items }),
                    tag: "ul",
                }, all),
              ),
            __("p", {}, "Drag and drop the name on the above section to display it."),
            ],
        );

        return __("div", {className: "columns-picker"}, [
            this.props.visible ? __(IconButton, {
                keyboardFocused: false,
                onTouchTap: this.handleShowDialog.bind(this),
                onClick: this.handleShowDialog.bind(this),
            }, __(FontIcon, {className: "fa fa-gear"})) : undefined,
            dialog,
        ]);

    }
}
