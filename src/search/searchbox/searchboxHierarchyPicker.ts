import { List, ListItem } from "@material-ui/core";
import { Component, createElement as __ } from "react";
import { HierarchicQueryValueMatch } from "../searchables";
import { ChipVM_t, SearchQueryElementToChipVM, ChipVMToChip } from "./common";
import * as _ from "react-dom-factories";
import { SearchQuery, ISynchronousTranslationService } from "../searchquery";
import { SELECTINTENDEDQUERY } from "../WordTranslator";
import { Dialog } from "@material-ui/core"
export type SearchboxHierarchyPickerProps = {
    open: boolean,
    pickedChip: (id: number[]) => void,
    handleClose: () => void,
    getHierarchicQueryValueMatch: () => HierarchicQueryValueMatch,
    translateSelectQuery: ISynchronousTranslationService,
};

export type SearchboxHierarchyPickerState = {
    showPossibilities: { id: number[], chips: ChipVM_t[] }[];
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
        Promise.all(possibilities.map((p) =>
            Promise.all(p.structure.elements.map((rootElement, i) => SearchQueryElementToChipVM(rootElement, p.index.concat([i]), () => { })))
                .then(vm => ({ id: p.index, chips: vm }))))
            .then(renderedPossibilities => { this.setState({ showPossibilities: renderedPossibilities }); });
    }
    public render() {
        return __(Dialog, { // Dialog to display the date (range) selector.
            key: "hierarchydialog",
            open: this.props.open,
            onClose: () => { this.props.pickedChip([]); this.props.handleClose(); },
            fullWidth: true,
            maxWidth: "md",
            className: "searchbox-hierarchy-dialog",
        },

            _.h3({ key: "select" }, this.props.translateSelectQuery(SELECTINTENDEDQUERY),
                __(List, { key: "itemsList" },
                    this.state.showPossibilities.map((p, i) => __(ListItem, {
                        key: i,
                        button: true,
                        onClick: () => this.props.pickedChip(p.id),
                    }, _.span({}, p.chips.map(chip => ChipVMToChip(chip, () => "..."))),
                    )))));
    }
}
