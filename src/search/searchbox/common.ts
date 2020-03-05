import { Chip } from "material-ui";
import * as Colors from "material-ui/styles/colors";
import { createElement as __, ReactElement } from "react";
import * as _ from "react-dom-factories";
import { IAutocompleteSuggestion, IExactValueMatch, ISearchableQueryElement } from "../searchables";
import { ISearchQueryElement, isHierarchicSearchQueryElement, ISimpleSearchQueryElement, ToFillInSearchQueryElement } from "../searchquery";
import { HierarchicChip, HierarchicChipProps } from "./Chips/HierarchicChip";
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
        return Promise.all([childVMsP, tooltip] as any[]).then(data => new HierarchicChipVM(sQE.getConnectWord(), data[1], index, true, data[0], () => onRemoveAtIndex(index)));
    }

    return Promise.all([sQE.getTooltipText(), sQE.getSimpleSearchbarText()]).then(texts =>
        new LeafChipVM(texts[0], texts[1], index, sQE.isReferential() ? Colors.blue100 : Colors.grey200, sQE.isRemovable(), () => onRemoveAtIndex(index), sQE instanceof ToFillInSearchQueryElement));
}

export const hasChipFillIn = (chipVM: ChipVM_t): boolean => (chipVM.leaf) ? chipVM.isFillIn : (<any>chipVM).children.some(hasChipFillIn);
export const HaveChipsFillIn = (chips: ChipVM_t[]): boolean => chips.some(hasChipFillIn);
export function ChipVMToChip(chipVM: ChipVM_t, getInputBox: () => any): ReactElement<any> {
    const deleteAction = chipVM.deletable ? () => chipVM.onDelete && chipVM.onDelete() : undefined;
    if (!chipVM.leaf) {
        const props: HierarchicChipProps = {
            children: (chipVM as HierarchicChipVM).children.map(c => ChipVMToChip(c, getInputBox)),
            label: (chipVM as HierarchicChipVM).connectWord,
            onDelete: deleteAction,
            onClick: () => { },
            onKeyDown: () => { },
            chipKey: chipVM.index.join(","),
            containsFillInChip: hasChipFillIn(chipVM),
        };
        const hierarchic = __(HierarchicChip, {
            ...props,
            key: "H" + chipVM.index.join("_"),
        });
        return hierarchic;
    }
    const nonHierarchicChipContext = chipVM.isFillIn ? getInputBox() : withTooltip(chipVM.searchbarText, chipVM.tooltipText);
    return __(Chip, {
        className: "searchbox-chip " + (chipVM.isFillIn ? "contains-fill-in" : ""),
        backgroundColor: chipVM.backgroundColor,
        key: "Q" + chipVM.index.join("_"),
        onRequestDelete: deleteAction,
    }, nonHierarchicChipContext);
}
export class LeafChipVM {
    public readonly leaf: true = true;
    constructor(
        public tooltipText: string,
        public searchbarText: string,
        public index: number[],
        public backgroundColor: string,
        public deletable: boolean,
        public onDelete?: () => void,
        public isFillIn = false) {

    }
}
export class HierarchicChipVM {
    public readonly leaf: false = false;
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
    matchKeyValueExact(key: string, value: string): Promise<IExactValueMatch>,
    searchedQueryElements: ReadonlyArray<ISimpleSearchQueryElement>,
    customButtons?: ReadonlyArray<ReactElement<any>>,              // list of custom buttons to add besides search and save icons
    translate: any,
    updateChipsOnConstruction?: boolean,
    autocompleteSuggestions: ReadonlyArray<IAutocompleteSuggestion>,
};

export type SearchBox_actions_t = {
    onRemoveQueryElement: (idx: number[]) => void,            // remove existing term.
    onRemoveLastQueryElement: () => void,
    onAddQueryElement: (element: ISimpleSearchQueryElement) => void,           // add new term or start search (when parameter is null)
    onAddHierarchyElement: (index: number[], type: "and" | "or") => void,
    onSearch: () => void,
    onInputChanged: (text: string) => void,         // called on any changes in the input box.
    onSaveAsQuery: (name: string, query: ReadonlyArray<ISimpleSearchQueryElement>) => void,          // called on request to save the current query as a new saved query.
    onChipsUpdated?: () => void,
    onDidUpdate?: () => void,
};
export type SearchBox_t = SearchBox_actions_t & SearchBox_data_t;
