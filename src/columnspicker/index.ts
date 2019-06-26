import { Dialog } from "@material-ui/core";
import FontIcon from "material-ui/FontIcon";
import IconButton from "material-ui/IconButton";
import { Component, createElement as __ } from "react";
import * as _ from "react-dom-factories";
import ColumnsPickerContent from "./content";
import "./index.less";

export type Column_t = {
    name: string,
    label: string,
    fixed?: boolean,
};

export type ColumnGroup_t = {
    name: string,
    label: string,
    columns: Column_t[][],
};

export type ColumnsPicker_t = {
    language: string,
    selectedColumns: string[], // list of names
    sets: ColumnSet_t[],
    onSetsChange: (sets: ColumnSet_t[]) => void,
    onDone: (selectedColumns: string[]) => void,
} & ({
    /** @deprecated, use columnGroups instead */
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

/**
 * ColumnsPicker
 *
 * Presents a dialog to select columns to be displayed in the doclist
 * This component also allows to save and recall columnsets that keep a group of columns to be selected
 *
 * @param selectedColumns Ordered list of column names that are currently shown
 * @param sets Column sets that are available
 * @param onSetsChange Called when column sets have changed and "Done" is pressed
 * @param onDone Called when "Done" is pressed with the columns that have been selected
 * @param allColumns A list of all columns that are available @deprecated Use columnGroups instead
 * @param columnGroups A list of all column groups that are available
 */
export class ColumnsPicker extends Component<ColumnsPicker_t, State_t> {

    constructor(props: ColumnsPicker_t) {
        super(props);
        this.state = {
            opened: false,
        };
        if (props.allColumns && process.env.NODE_ENV !== "production") {
            console.warn("finder-ui: ColumnsPicker: prop allColumns is deprecated. Use columnGroups instead");
        }
    }
    public render() {
        const dialog = __(ColumnsPickerContent, {
            key:"dialog",
            opened: this.state.opened,
            selectedColumns: this.props.selectedColumns,
            sets: this.props.sets,
            onSetsChange: this.props.onSetsChange,
            onDone: this.props.onDone,
            onClose: () => this.setState({ opened: false }),
            columnGroups: this.props.columnGroups || [{
                name: "all",
                label: "All",
                columns: [this.props.allColumns!],
            }],
            language: this.props.language,
            onDismiss: () => this.setState({ opened: false }),
        });

        return _.div({ className: "columns-picker",key:"columns-picker" }, [
            __(IconButton, {
                key: "button",
                keyboardFocused: false,
                onClick: () => this.setState({ opened: true }),
            }, __(FontIcon, { className: "fa fa-gear" })),
            dialog,
        ]);

    }
}
