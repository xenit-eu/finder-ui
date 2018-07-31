import { Chip } from "material-ui";
import * as Colors from "material-ui/styles/colors";
import { createElement as __, ReactElement } from "react";
import * as _ from "react-dom-factories";
import { IAutocompleteSuggestion, ISearchableQueryElement, ISimpleSearchQueryElement } from "..";
import { HierarchicChip, HierarchicChipProps } from "../HierarchicChip";
import { ISearchQueryElement, isHierarchicSearchQueryElement } from "./../searchquery";

export function getKeyValue(s: string | undefined): { key: string, value: string } {
    if (!s) {
        return { key: "", value: "" };
    }
    const splits = s.split(":");
    if (splits.length >= 2) {
        return { key: splits[0], value: splits[1] };
    }
    return { key: "", value: splits[0] };
}
export function withTooltip(label: string, tooltip: string): ReactElement<any> {
    return _.span({ title: tooltip }, label);
}
export function SearchQueryElementToChipVM(sQE: ISearchQueryElement, index: number[], onRemoveAtIndex: (index: number[]) => void): Promise<ChipVM_t> {
    if (isHierarchicSearchQueryElement(sQE)) {
        const childVMsP = Promise.all(sQE.children.map((e, i) => SearchQueryElementToChipVM(e, index.concat([i]), onRemoveAtIndex)));
        const tooltip = sQE.getTooltipText();
        return Promise.all([childVMsP, tooltip] as any[]).then(data => new HierarchicChipVM(sQE.getConnectWord(), data[1], index, true, data[0]));
    }

    return Promise.all([sQE.getTooltipText(), sQE.getSimpleSearchbarText()]).then(texts =>
        new LeafChipVM(texts[0], texts[1], index, sQE.isReferential() ? Colors.blue100 : Colors.grey200, sQE.isRemovable(), () => onRemoveAtIndex(index)));
}

export function ChipVMToChip(chipVM: ChipVM_t): ReactElement<any> {
    const deleteAction = chipVM.deletable ? () => chipVM.onDelete && chipVM.onDelete() : undefined;
    if (!chipVM.leaf) {
        const props: HierarchicChipProps = {
            children: (chipVM as HierarchicChipVM).children.map(c => ChipVMToChip(c)),
            label: (chipVM as HierarchicChipVM).connectWord,
            onDelete: deleteAction,
            onClick: () => { },
            onKeyDown: () => { },
            key: chipVM.index.join(","),
        };
        const hierarchic = __(HierarchicChip, props);
        return hierarchic;
    }
    return __(Chip, {
        className: "searchbox-chip",
        backgroundColor: chipVM.backgroundColor,
        key: "Q" + chipVM.index.join("_"),
        onRequestDelete: deleteAction,
    }, withTooltip(chipVM.searchbarText, chipVM.tooltipText));
}
export class LeafChipVM {
    public readonly leaf = true;
    constructor(
        public tooltipText: string,
        public searchbarText: string,
        public index: number[],
        public backgroundColor: string,

        public deletable: boolean,
        public onDelete?: () => void) {

    }
}
export class HierarchicChipVM {
    public readonly leaf = false;
    constructor(
        public connectWord: string,
        public tooltip: string,
        public index: number[],
        public deletable: boolean,
        public children: ReadonlyArray<ChipVM_t>,
        public onDelete?: () => void,
    ) {

    }
}
export type ChipVM_t = LeafChipVM | HierarchicChipVM;
export type SearchBox_data_t = {
    searching: boolean,                             // flag indicating that search process is busy => activate spinner !
    searchableQueryElements: ISearchableQueryElement[],            // suggestions to be proposed on the drop-down list.
    searchedQueryElements: ISimpleSearchQueryElement[],
    customButtons?: Array<ReactElement<any>>,              // list of custom buttons to add besides search and save icons
    translations?: any,
    updateChipsOnConstruction?: boolean,
    autocompleteSuggestions: IAutocompleteSuggestion[],
};

export type SearchBox_actions_t = {
    onRemoveQueryElement: (idx: number[]) => void,            // remove existing term.
    onRemoveLastQueryElement: () => void,
    onAddQueryElement: (element: ISimpleSearchQueryElement) => void,           // add new term or start search (when parameter is null)
    onAddHierarchyElement: (index: number[], type: "and" | "or") => void,
    onSearch: () => void,
    onInputChanged: (text: string) => void,         // called on any changes in the input box.
    onSaveAsQuery: (name: string, query: ISimpleSearchQueryElement[]) => void,          // called on request to save the current query as a new saved query.
    onChipsUpdated?: () => void,
    onDidUpdate?: () => void,
};
export type SearchBox_t = SearchBox_actions_t & SearchBox_data_t;
