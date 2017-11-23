import AutoComplete from "material-ui/AutoComplete";
import Chip from "material-ui/Chip";
import CircularProgress from "material-ui/CircularProgress";
import DatePicker from "material-ui/DatePicker";
import RefreshIndicator from "material-ui/RefreshIndicator";
import SearchIcon from "material-ui/svg-icons/action/search";
import { createElement as __, CSSProperties, DOM as _, KeyboardEvent, ReactElement } from "react";

/* tslint:disable */
export type SearchQueryElementKeyTranslate = (k: string) => string;
export type SearchQueryElementValueTranslate = (el: ISearchQueryElement) => string;
export type SearchQueryElementKeyValueTranslate = { translateValueOfQueryElement: SearchQueryElementValueTranslate, translateKey: SearchQueryElementKeyTranslate };
export type ISearchQueryContext = {
    IncludedPropsWithList: { [name: string]: string[] },
    PropsToShow: string[],
    translateKey: SearchQueryElementKeyTranslate,
    translateValueOfQueryElement: SearchQueryElementValueTranslate,
    IsDate: (k: string) => boolean
}

export type SearchKey = string;
/* tslint:enable */

export interface ISearchQueryElement {
    key: SearchKey | undefined;
    value: any;
    GetTranslatedKey(context: ISearchQueryContext): string | undefined;
    GetTranslatedValue(context: ISearchQueryContext): string | undefined;
    GetApixQuery(): any;
}

export interface ISearchQuery {
    GetApixQuery(): any;
    AddElement(el: ISearchQueryElement): void;
    GetDescriptionText(translate: SearchQueryElementKeyValueTranslate): string;
    clone(): ISearchQuery;
    elements: ISearchQueryElement[];
}

const searchIconStyle: CSSProperties = {
    position: "relative",
    top: "-12px",
    left: "10px",
};

const iconColor = "#512e5f";

export type ReactSearchBox_t = {
    translateSearchKeyword: (keyword: string) => string,
    searching: boolean,                     // flag indicating that search process is busy => activate spinnger !
    terms: ISearchQuery,                        // list of existing terms already requested for search.
    suggestionList: Array<{ label: string, value: string }>,               // suggestions to be proposed on the drop-down list.
    onRemove: (idx: number) => void,        // remove existing term.
    onDoSearch: () => void,
    onAddChip: (text: string) => void, // add new term.
    onInputChanged: (text: string) => void,
    searchText: string,
    context: ISearchQueryContext,
};
function HandleRequest(chosenRequest: any, index: number, onDoSearch: () => void, OnAddChip: (text: string) => void, onInputChanged: (text: string) => void) {
    if (index === -1) {//Enter in text
        let chosenRequestStr: string = chosenRequest;
        if (chosenRequest.length === 0) {
            onDoSearch();
        } else {
            OnAddChip(chosenRequestStr);
        }
        return;
    }
    //now index is something selected, therefore a { label: string, value: string }
    let chosenRequestLabVal: { label: string, value: string } = chosenRequest;
    const noValidChipYet = chosenRequest.value.indexOf(":") < 0 || (!chosenRequest.value.split(":")[1]) || (chosenRequest.value.split(":")[1].trim().length === 0);
    if (noValidChipYet) { //Just selected the key, no chip yet.
        onInputChanged(chosenRequestLabVal.value);
    } else {
        OnAddChip(chosenRequestLabVal.value);
    }
}

function buildChip(translateSearchKeyword: (keyword: string) => string, context: ISearchQueryContext, term: ISearchQueryElement, index: number, onRemove: (index: number) => void) {
    const buildDatePicker = (keyWord: string) =>
        _.span({ style: { display: "Inline-Block" } }, translateSearchKeyword(keyWord) + " ", __(DatePicker, { style: { display: "inline" }, textFieldStyle: { width: "90px" } }));
    const keyText = term.GetTranslatedKey(context) + ": ";
    if (term.value.type === "TEXT" || term.value.type === "TODAY" || term.value.type === "LASTYEAR" || term.value.type === "LASTWEEK" || term.value.type === "LASTMONTH") {
        let content = [keyText + term.GetTranslatedValue(context)];
        return __(Chip, { key: index, onRequestDelete: () => onRemove(index) }, content);
    }
    if (term.value.type === "FROM") {
        return __(Chip, { key: index, onRequestDelete: () => onRemove(index) }, [keyText, buildDatePicker("FROM")]);
    }
    if (term.value.type === "UNTIL") {
        return __(Chip, { key: index, onRequestDelete: () => onRemove(index) }, [keyText, buildDatePicker("UNTIL")]);
    }
    if (term.value.type === "BETWEEN") {
        return __(Chip,
            {
                key: index,
                onRequestDelete: () => onRemove(index),
            },
            _.span({ style: { whiteSpace: "nowrap", display: "inline" } }, [keyText, buildDatePicker("BETWEEN"), buildDatePicker("BETWEENAND")]));
    }
}

let autocompleteStyle: CSSProperties = { flex: "1 1 auto", display: "inline-block", overflow: "hidden", border: 0, height: "90%", width: "100%" };
export function ReactSearchBox({translateSearchKeyword, context, searching, searchText, terms, suggestionList, onRemove, onAddChip, onDoSearch, onInputChanged}: ReactSearchBox_t): ReactElement<any> {
    return _.div({ className: "search-box" }, [
        ...terms.elements.map((t: any, i: number) => buildChip(translateSearchKeyword, context, t, i, onRemove)),
        _.div({style: autocompleteStyle}, __(AutoComplete, {
            fullWidth: true,
            searchText,
            key: "input",
            filter: AutoComplete.caseInsensitiveFilter,
            hintText: "Type search term or 'Enter' to close term...",
            dataSource: suggestionList.map(s => ({ text: s.label, value: s.value })),
            onUpdateInput: (e: any) => { onInputChanged(e); }, //any is {text:string,value:string}, fault in typings material-ui
            onNewRequest: (chosenRequest: any, index: number) => { HandleRequest(chosenRequest, index, onDoSearch, onAddChip, onInputChanged); },
            openOnFocus: true,
        }))
        , _.div({ key: "div", className: "search-icon" },
            searching
                ? __(CircularProgress, { size: 24 })
                : __(SearchIcon, { color: iconColor, onClick: () => onDoSearch() }),
        )]);
}
