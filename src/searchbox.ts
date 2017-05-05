import Chip from "material-ui/Chip";
import CircularProgress from "material-ui/CircularProgress";
import RefreshIndicator from "material-ui/RefreshIndicator";
import SearchIcon from "material-ui/svg-icons/action/search";
import { createElement as __, DOM as _, KeyboardEvent, ReactElement } from "react";

// import { addTerm, delTerm, termNameMapping } from "./terms";

import "./searchbox.less";

const searchIconStyle = {
    position: "relative",
    top: "-12px",
    left: "10px",
};

const iconColor = "#512e5f";

// onEnter(input.value, terms);

const reNameValue = /\w+\s*\:\s*\w+/;

function detectEnterKey(evt: KeyboardEvent, onSuccess: (enteredText: string) => void, onInputChanged: (newText: string) => void): void {
    const input = <HTMLInputElement> evt.target;
    if (evt.keyCode === 13 && (!input.value || reNameValue.test(input.value))) {
        onSuccess(input.value);
        input.value = "";
        return;
    }
    if (onInputChanged) {
        onInputChanged(input.value);
    }
}

export type Term_t = {
    name: string,
    label: string,
    value: string,
};

export type SearchBox_t = {
    searching: boolean,                     // flag indicating that search process is busy => activate spinnger !
    terms: Term_t[],                        // list of existing terms already requested for search.
    suggestionList: string[],               // suggestions to be proposed on the drop-down list.
    onRemove: (idx: number) => void,        // remove existing term.
    onEnter: (text: string) => void,        // add new term.
    onInputChanged: (text: string) => void,
};


//@Component SearchBox
//@ComponentDescription "Input box allowing the search by terms (node name, creator, ...)."
//@Method SearchBox Returns ReactComponent
//@MethodDescription "SearchBox({param1: value1, param2: value2, ...})"
//@Param onEnter (text:string)=>void "callback called when a new text (eventually a term) has been entered."
//@Param onInputChanged (text:string)=>void ""
//@Param onRemove (idx:number)=>void "callback called to remove an existing term."
//@Param searching boolean "flag indicating that search process is busy => activate spinner !"
//@Param suggestionList string[] "suggestions to be proposed on the drop-down list when entering a term name."
//@Param terms Term_t[] "list of existing terms already requested for search."

export function SearchBox({ onEnter, onInputChanged,onRemove, searching,suggestionList, terms }: SearchBox_t): ReactElement<any> {
    return _.div({ className: "search-box" }, [
        ...terms.map((t, i) => __(Chip, { key: i, onRequestDelete: () => onRemove(i) }, t.label + ":" + t.value)),
        _.input({ key: "input", list: "dropdown-list", placeholder: "Type search term or 'Enter' to start searching...", onKeyUp: (evt: any) => detectEnterKey(evt, onEnter, onInputChanged) }),
        _.datalist({ key: "datalist", id: "dropdown-list" }, suggestionList.map(n => _.option({ key: n }, n))),
        _.div({ key: "div", className: "search-icon" },
            searching
                ? __(CircularProgress, { size: 24 })
                : __(SearchIcon, { color: iconColor, onClick: () => onEnter("") }),
        ),
    ]);
}
