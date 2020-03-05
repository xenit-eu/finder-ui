import { Dialog, DialogTitle, List, ListItem } from "@material-ui/core";
import { Component, createElement as __ } from "react";
import * as _ from "react-dom-factories";
import { SELECTINTENDEDQUERY } from "../../WordTranslator";
import { HierarchicQueryValueMatch } from "../searchables";
import { ISynchronousTranslationService, SearchQuery } from "../searchquery";
import { ChipVM_t, ChipVMToChip, SearchQueryElementToChipVM } from "./common";
export type SearchboxHierarchyPickerProps = {
    open: boolean,
    pickedChip: (id: number[]) => void,
    handleClose: () => void,
    getHierarchicQueryValueMatch: () => HierarchicQueryValueMatch,
    translateSelectQuery: ISynchronousTranslationService,
};

export type SearchboxHierarchyPickerState = {
    showPossibilities: Array<{ id: number[], chips: ChipVM_t[] }>;
};

export class SearchboxHierarchyPicker extends Component<SearchboxHierarchyPickerProps, SearchboxHierarchyPickerState> {

    public constructor(props: SearchboxHierarchyPickerProps) {
        super(props);
        this.state = { showPossibilities: [] };
    }
    public componentDidMount() {
        this.updateUIVM(this.props.getHierarchicQueryValueMatch());
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
            onClose: () => { this.props.handleClose(); },
            fullWidth: true,
            maxWidth: "md",
            className: "searchbox-hierarchy-dialog",
        },
            __(DialogTitle, {}, this.props.translateSelectQuery(SELECTINTENDEDQUERY)),
            __(List, { key: "itemsList" },
                this.state.showPossibilities.map((p, i) => __(ListItem, {
                    key: i,
                    button: true,
                    onClick: () => this.props.pickedChip(p.id),
                }, _.span({}, p.chips.map(chip => ChipVMToChip(chip, () => "..."))),
                )),
            ),
        );
    }
}
