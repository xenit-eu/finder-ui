import { DOM as _, createElement as __, KeyboardEvent, ReactElement } from 'react';
import Chip from 'material-ui/Chip';

//import { addTerm, delTerm, termNameMapping } from "./terms";

import SearchIcon from 'material-ui/svg-icons/action/search';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import CircularProgress from 'material-ui/CircularProgress';

const searchIconStyle = {
    position: 'relative',
    top: '-12px',
    left: '10px'
};

const iconColor = '#512e5f';

//onEnter(input.value, terms);

function detectEnterKey(evt : KeyboardEvent, onSuccess: (enteredText: string) => void): void {
    var input = <HTMLInputElement>evt.target;
    var re = /\w+\s*\:\s*\w+/
    if (evt.keyCode === 13 && (!input.value || re.test(input.value))) {
        onSuccess(input.value);
        input.value = "";
    }
}

export type Term_t = {
    name: string,
    label: string,
    value: string
}

export type SearchBox_t = {
    searching: boolean,                 // flag indicating that search process is busy => activate spinnger ! 
    terms: Term_t[],                    // list of existing terms already requested for search.
    suggestionList : string[],          // suggestions to be proposed on the drop-down list.
    onRemove: (idx : number) => void,   // remove existing term.
    onEnter: (text : string) => void    // add new term.
};


export function SearchBox({searching, terms, suggestionList, onRemove, onEnter} : SearchBox_t) : ReactElement<any> {
    return _.div({ className: 'search-box' }, [
        ...terms.map((t, i) => __(Chip, { key: t.name, onRequestDelete: () => onRemove(i) }, t.label + ":" + t.value)),
        _.input({ key: "3", list: 'dropdown-list', placeholder: "Type search term...", onKeyUp: (evt : any) => detectEnterKey(evt, text => onEnter(text)) }),
        _.datalist({ key: "4", id: "dropdown-list" }, suggestionList.map(n => _.option({key: n}, n + ':'))),
        _.div({ key: "5", className: 'search-icon' },
            searching
                ? __(CircularProgress, { size: 24 })
                : __(SearchIcon, { color: iconColor, onClick: () => onEnter("") })
        )
    ]);
}

