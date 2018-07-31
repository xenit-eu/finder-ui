import { List, ListItem } from "@material-ui/core";
import Dialog from "material-ui/Dialog";
import { Component, createElement as __ } from "react";
import { HierarchicQueryValueMatch } from "../searchables";
import { ChipVM_t, SearchQueryElementToChipVM, ChipVMToChip } from "./common";
import * as _ from "react-dom-factories";

export type SearchboxHierarchyPickerProps = {
    open: boolean,
    pickedChip: (id: number[]) => void,
    handleClose: () => void,
    getHierarchicQueryValueMatch: () => HierarchicQueryValueMatch,
};

export type SearchboxHierarchyPickerState = {
    showPossibilities: { id: number[], chip: ChipVM_t }[];
};

export class SearchboxHierarchyPicker extends Component<SearchboxHierarchyPickerProps, SearchboxHierarchyPickerState> {
    public constructor(props: SearchboxHierarchyPickerProps) {
        super(props);
        this.state = { showPossibilities: [] };
    }
    public componentWillReceiveProps(nextProps: SearchboxHierarchyPickerProps) {
        this.updateUIVM(nextProps.getHierarchicQueryValueMatch());
    }
    public updateUIVM(info: HierarchicQueryValueMatch) {
        const possibilities = info.hierarchyInfo.possibilities;
        Promise.all(possibilities.map(p => SearchQueryElementToChipVM(p.structure, p.index, (i) => { }).then(vm => ({ id: p.index, chip: vm }))))
            .then(renderedPossibilities => { this.setState({ showPossibilities: renderedPossibilities }); });
    }
    public render() {
        return __(Dialog, { // Dialog to display the date (range) selector.
            key: "hierarchydialog",
            open: this.props.open,
            onRequestClose: () => { this.props.pickedChip([]); this.props.handleClose(); },
            contentStyle: { width: "365px" },
            contentClassName: "searchbox-hierarchy-dialog",
        },

            _.h3({ key: "select" }, "Select the part of the search query that wil be surrounded with the hierarchy query."),
            __(List, { key: "itemsList" },
                this.state.showPossibilities.map((p, i) => __(ListItem, {
                    key: i,
                    button: true,
                    onClick: () => this.props.pickedChip(p.id),
                }, ChipVMToChip(p.chip)),
                )));
    }
}
