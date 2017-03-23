import { DOM as _, createElement as __, KeyboardEvent, ReactElement } from 'react';
import Chip from 'material-ui/Chip';

//import { addTerm, delTerm, termNameMapping } from "./terms";

import SearchIcon from 'material-ui/svg-icons/action/search';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import CircularProgress from 'material-ui/CircularProgress';

import './searchbox.less';

const searchIconStyle = {
    position: 'relative',
    top: '-12px',
    left: '10px'
};

const iconColor = '#512e5f';

//onEnter(input.value, terms);

const reNameValue = /\w+\s*\:\s*\w+/

function detectEnterKey(evt: KeyboardEvent, onSuccess: (enteredText: string) => void, onInputChanged: (newText: string) => void): void {
    var input = <HTMLInputElement>evt.target;
    if (evt.keyCode === 13 && (!input.value || reNameValue.test(input.value))) {
        onSuccess(input.value);
        input.value = "";
        return;
    }
    onInputChanged && onInputChanged(input.value);
}

export type Term_t = {
    name: string,
    label: string,
    value: string
}

export type SearchBox_t = {
    searching: boolean,                     // flag indicating that search process is busy => activate spinnger ! 
    terms: Term_t[],                        // list of existing terms already requested for search.
    suggestionList: string[],               // suggestions to be proposed on the drop-down list.
    onRemove: (idx: number) => void,        // remove existing term.
    onEnter: (text: string) => void,        // add new term.
    onInputChanged: (text: string) => void
};


export function SearchBox({searching, terms, suggestionList, onRemove, onEnter, onInputChanged}: SearchBox_t): ReactElement<any> {
    return _.div({ className: 'search-box' }, [
        ...terms.map((t, i) => __(Chip, { key: i, onRequestDelete: () => onRemove(i) }, t.label + ":" + t.value)),
        _.input({ key: "input", list: 'dropdown-list', placeholder: "Type search term or 'Enter' to start searching...", onKeyUp: (evt: any) => detectEnterKey(evt, onEnter, onInputChanged) }),
        _.datalist({ key: "datalist", id: "dropdown-list" }, suggestionList.map(n => _.option({ key: n }, n))),
        _.div({ key: "div", className: 'search-icon' },
            searching
                ? __(CircularProgress, { size: 24 })
                : __(SearchIcon, { color: iconColor, onClick: () => onEnter("") })
        )
    ]);
}

