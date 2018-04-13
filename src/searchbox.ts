import "es6-shim";
import { Menu, MenuItem, Paper, Popover } from "material-ui";
import Chip from "material-ui/Chip";
import CircularProgress from "material-ui/CircularProgress";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import RefreshIndicator from "material-ui/RefreshIndicator";
import * as Colors from "material-ui/styles/colors";
import SearchIcon from "material-ui/svg-icons/action/search";
import StarIcon from "material-ui/svg-icons/toggle/star-border";

import { FinderQuery, Query_t } from "./";

declare var require: any;
// tslint:disable-next-line:no-var-requires
const Flatpickr = require("react-flatpickr");

import { Component, createElement as __, DOM as _, KeyboardEvent, ReactElement } from "react";

import "react-flatpickr/node_modules/flatpickr/dist/themes/material_blue.css";
import "./searchbox.less";

const DAY: number = 24 * 3600 * 1000;

const searchIconStyle = {
    position: "relative",
    top: "-12px",
    left: "10px",
};

export const iconColor = "#512e5f";

const reNameValue: RegExp = /^([^\:]+)\:\s*(.+)\s*$/;
const reNoNameJustValue: RegExp = /[^\:]/;
const reQuery: RegExp = /\[([\w\s\-\_]+)\]/;

function toDateString(d: Date): string {
    return new Date(d.getTime() + (5 * 3600 * 1000)).toISOString().substring(0, 10);
}

function addMonths(d: Date, months: number): Date {
    let result = new Date(d.valueOf());
    result.setMonth(result.getMonth() + months);
    return result;
}

function addDays(d: Date, days: number): Date {
    return new Date(d.getTime() + (days * DAY));
}

export type Value_t = string | {label: string, value: string};

export type SearchableTerm_t = {
    name: string,
    label: string,
    type: string, // "text" | "enum" | "date"
    values: Value_t[],
};

//@Type  "Term structure"
//@TypeDescription  "Term structure"
export type Term_t = {
    name: string, //@TypeParam internal name of the term
    label: string, //@TypeParam displayable name of the term
    value: string, //@TypeParam value entered for this term
    valueLabel?: string,  // to be displayed in place of value when specified (value still to be used for searching!)
};

export const ValueNoKeyTerm = "ValueNoKeyTerm";
export const PLACEHOLDERTRANSLATION = "PLACEHOLDERTRANSLATION";
export const PLACEHOLDERDEFAULT = "Type search term/query or 'Enter' to start searching...";
export const DATEPICKERLOCALE = "DATEPICKERLOCALE";
export const DATEPICKERDEFAULT = {};

export type SearchBox_data_t = {
    searching: boolean,                             // flag indicating that search process is busy => activate spinner !
    searchedTerms: Term_t[],                        // list of terms requested for search.
    searchableTerms: SearchableTerm_t[],            // suggestions to be proposed on the drop-down list.
    autocompleteTerms?: Term_t[],
    searchedQueries: Query_t[],                     // list of queries requested for search.
    searchableQueries: Query_t[],                   // suggestions queries.
    customButtons?: Array<ReactElement<any>>,              // list of custom buttons to add besides search and save icons
    allowValueNoKeyTerm?: boolean,
    translations?: any,
};

export type SearchBox_actions_t = {
    onRemoveTerm: (idx: number) => void,            // remove existing term.
    onRemoveQuery: (idx: number) => void,           // remove existing term.
    onEnter: (text: Term_t | null) => void,           // add new term or start search (when parameter is null)
    onAddQuery: (query: Query_t) => void,           // add new query to the searchedQueries.
    onInputChanged: (text: string) => void,         // called on any changes in the input box.
    onSaveAsQuery: (name: string, query: FinderQuery) => void,          // called on request to save the current query as a new saved query.
};
export type SearchBox_t = SearchBox_actions_t & SearchBox_data_t;
type State_t = {
    textValue?: string,
    suggestionsOpened?: boolean,
    focusSuggestions?: boolean,
    currentTerm?: SearchableTerm_t | null,
    calendarOpen?: boolean,
    calendarMode?: string,
};

//@Component SearchBox
//@ComponentDescription "Input box allowing the search by terms (node name, creator, ...)."
//@Method SearchBox Returns ReactComponent
//@MethodDescription "SearchBox({param1: value1, param2: value2, ...})"
//@Param onEnter (text:string)=>void "callback called when a new text (eventually a term) has been entered."
//@Param onInputChanged (text:string)=>void ""
//@Param onRemove (idx:number)=>void "callback called to remove an existing term."
//@Param searching boolean "flag indicating that search process is busy => activate spinner !"
//@Param searchableTerms SearchableTerm_t[] "suggestions to be proposed on the drop-down list when entering a term name."
//@Param terms Term_t[] "list of existing terms already requested for search."

export class SearchBox extends Component<SearchBox_t, State_t> {

    private inputElem: HTMLInputElement | null;
    private selectedDates: Date[] = [];

    constructor(props: SearchBox_t) {
        super(props);
        this.state = {
            textValue: "",
            currentTerm: null,
            suggestionsOpened: false,
            focusSuggestions: false,
            calendarOpen: false,
            calendarMode: "single",
        };
    }

    public addNewTerm(term: Term_t) {
        this.props.onEnter(term);
        this.setState({ textValue: "", currentTerm: null });
        this.hideSuggestions();
    }

    public addNewQuery(query: Query_t) {
        this.props.onAddQuery(query);
        this.setState({ textValue: "" });
        this.hideSuggestions();
    }

    public handleInputChange(event: KeyboardEvent<HTMLInputElement>) {
        const input: HTMLInputElement = <HTMLInputElement>event.target;
        const val = input.value;
        this.onInputChange(val, false);
    }

    public onInputChange(val: string, isAutocompleteClick: boolean) {
        let currentTerm = this.props.searchableTerms.filter(t => new RegExp("^\\s*" + t.label + "\\s*\\:", "i").test(val))[0];
        this.setState({ textValue: val, currentTerm, suggestionsOpened: val.length > 0 });

        if (val.endsWith(":on...") || val.endsWith(":after...") || val.endsWith(":before...")) {
            this.setState({ calendarOpen: true, calendarMode: "single" });
        } else if (val.endsWith(":between...")) {
            this.setState({ calendarOpen: true, calendarMode: "range" });
        } else if (val.endsWith(":today")) {
            if (currentTerm && currentTerm.type === "date") {
                this.addNewTerm({ name: currentTerm.name, label: currentTerm.label, value: toDateString(new Date()) + ".." + toDateString(new Date()) });
            }
        } else if (val.endsWith(":last week")) {
            if (currentTerm && currentTerm.type === "date") {
                this.addNewTerm({ name: currentTerm.name, label: currentTerm.label, value: toDateString(addDays(new Date(), -7)) + ".." + toDateString(new Date()) });
            }
        } else if (val.endsWith(":last month")) {
            if (currentTerm && currentTerm.type === "date") {
                this.addNewTerm({ name: currentTerm.name, label: currentTerm.label, value: toDateString(addMonths(new Date(), -1)) + ".." + toDateString(new Date()) });
            }
        } else if (currentTerm && currentTerm.type === "enum") {
            if (!val.endsWith(":")) {
                const match = reNameValue.exec(val);
                if (match) {
                    const valList = currentTerm.values.filter(v => typeof v === "string" ? v === match[1] : v.label === match[1]);
                    if (valList.length > 0) {
                        const valueOrObj = valList[0];
                        if (typeof valueOrObj === "string") {
                            this.addNewTerm({ name: currentTerm.name, label: currentTerm.label, value: valueOrObj });
                        } else {
                            this.addNewTerm({ name: currentTerm.name, label: currentTerm.label, value: valueOrObj.value, valueLabel: valueOrObj.label });
                        }
                    }
                }
            }
        } else if (reQuery.test(val)) {  // query has been encoded.
            const match = reQuery.exec(val);
            if (match) {
                const label = match[1];
                const query = this.props.searchableQueries.filter(q => q.label === label)[0];
                if (query) {
                    this.addNewQuery(query);
                }
            }
        } else if (isAutocompleteClick && this.props.autocompleteTerms) {
            const match = reNameValue.exec(val);
            if (match) {
                const autocompleteTerm = this.props.autocompleteTerms.find(term => term.label === match[1] && (term.valueLabel || term.value) === match[2]);
                if (autocompleteTerm) {
                    this.addNewTerm(autocompleteTerm);
                }
            }

        }
    }

    private getAutocompleteList(): string[] {
        if (this.state.currentTerm) {
            const currentTerm = this.state.currentTerm;
            switch (currentTerm.type) {
                case "date":
                    return ["today", "last week", "last month", "on...", "after...", "before...", "between..."].map(t => currentTerm.label + ":" + t);
                case "enum":
                case "text":
                    if(currentTerm.values && currentTerm.values.length > 0) {
                        return currentTerm.values.map(t => typeof t === "object" ? t.label : t).map(t => currentTerm.label + ":" + t);
                    }
                default:
            }
        }
        return [
            ...this.props.searchableQueries.sort().map(t => "[" + t.label + "]"),
            ...this.props.searchableTerms.sort().map(t => t.label + ":"),
            ...(this.props.autocompleteTerms || []).map(t => t.label + ":" + (t.valueLabel || t.value)),
        ];
    }

    private hideSuggestions() {
        this.setState({ suggestionsOpened: false, focusSuggestions: false });
    }

    public handleInputKey(evt: KeyboardEvent<HTMLInputElement>): void {
        const input = <HTMLInputElement>evt.target;
        switch (evt.keyCode) {
            case 13: // ENTER
                if (!input.value) { // Enter press with empty input => call onEnter with null.
                    this.props.onEnter(null);
                } else if (this.state.currentTerm) {
                    const m = reNameValue.exec(input.value);
                    if (m && !(["on...", "after...", "before...", "between..."].indexOf(m[2]) >= 0)) {
                        this.addNewTerm({ name: this.state.currentTerm.name, label: this.state.currentTerm.label, value: m[2] });
                        this.hideSuggestions();
                    }
                } else if (this.props.allowValueNoKeyTerm && reNoNameJustValue.test(input.value)) {
                    this.addNewTerm({ name: ValueNoKeyTerm, label: ValueNoKeyTerm, value: input.value });
                    this.hideSuggestions();
                }
                break;
            default:
                if (this.props.onInputChanged) {
                    this.props.onInputChanged(input.value);
                }
        }
    }

    public handleDateSelection(selected: Date[]) {
        this.selectedDates = selected;
    }

    public handleCloseDialog() {
        const inputValue = <string>this.state.textValue;
        const arrow = "\u2192";

        if (this.state.currentTerm && this.state.currentTerm.type === "date") {
            let dateRange = toDateString(this.selectedDates[0]) + ".." + toDateString(this.selectedDates[0]);
            let dateRangeLabel = dateRange;

            if (/\:on\.\.\./.test(inputValue)) {
                dateRange = toDateString(this.selectedDates[0]) + ".." + toDateString(this.selectedDates[0]);
                dateRangeLabel = toDateString(this.selectedDates[0]);
            }
            if (/\:before\.\.\./.test(inputValue)) {
                dateRange = "MIN.." + toDateString(this.selectedDates[0]);
                dateRangeLabel = arrow + toDateString(this.selectedDates[0]);
            }
            if (/\:after\.\.\./.test(inputValue)) {
                dateRange = toDateString(this.selectedDates[0]) + "..MAX";
                dateRangeLabel = toDateString(this.selectedDates[0]) + arrow;
            }
            if (/\:between\.\.\./.test(inputValue) && this.selectedDates.length > 1) {
                dateRange = toDateString(this.selectedDates[0]) + ".." + toDateString(this.selectedDates[1]);
                dateRangeLabel = toDateString(this.selectedDates[0]) + arrow + toDateString(this.selectedDates[1]);
            }
            this.addNewTerm({ name: this.state.currentTerm.name, label: this.state.currentTerm.label, value: dateRange, valueLabel: dateRangeLabel });
        }
        this.setState({ calendarOpen: false });
    }

    private withTooltip(label: string, tooltip: string): ReactElement<any> {
        return _.span({ title: tooltip }, label);
    }

    public render() {

        const dialogButtons = [
            __(FlatButton, {
                key: "done-button",
                label: "Done",
                primary: true,
                keyboardFocused: false,
                onTouchTap: this.handleCloseDialog.bind(this),
                onClick: this.handleCloseDialog.bind(this),
            }),
        ];
        let me = this;
        function termToChip(t: Term_t, i: number) {
            return __(
                Chip,
                { key: "T" + i, className: "searchbox-chip", onRequestDelete: () => me.props.onRemoveTerm(i) },
                ((t.label && t.label.length > 0) ? t.label + ":" : "") + (t.valueLabel ? t.valueLabel : t.value));
        }
        const filteredSuggestionsList = (this.getAutocompleteList() || [])
            .filter(option => option.toLowerCase().includes((this.state.textValue || "").toLowerCase()));

        return _.div({ key: "search-box", className: "search-box" }, [
            (this.props.searchedQueries.length === 0 && this.props.searchedTerms.length === 0)?__(Chip, {
                className: "searchbox-chip searchbox-chip-default",
                key: "Default",
            }, "All:*"):undefined,
            ...this.props.searchedQueries.map((t, i) => __(Chip, {
                className: "searchbox-chip",
                backgroundColor: Colors.blue100,
                key: "Q" + i,
                onRequestDelete: () => this.props.onRemoveQuery(i),
            }, this.withTooltip("[" + t.label + "]", new FinderQuery(t.query).toHumanReadableString()))),
            ...this.props.searchedTerms.map((t, i) => termToChip(t, i)),
            _.div({ className: "searchbox-input-area" }, [
                __(SearchboxAutocomplete, {
                    value: <string>this.state.textValue,
                    onChange: this.handleInputChange.bind(this),
                    onKeyUp: this.handleInputKey.bind(this),
                    onFocus: () => this.setState({ focusSuggestions: false }),

                    open: <boolean>this.state.suggestionsOpened,
                    focusAutocomplete: <boolean>this.state.focusSuggestions,
                    suggestions: filteredSuggestionsList,
                    onSuggestionClick: (suggestion: string) => this.onInputChange(suggestion, true),
                    onDismiss: () => this.hideSuggestions(),
                    onRequestAutocomplete: () => this.setState({ suggestionsOpened: true, focusSuggestions: true }),
                    translations: this.props.translations,
                }),

                _.div({ className: "searchbox-icon-wrapper" }, [

                    ...(this.props.customButtons || []),

                    _.div({ key: "save-icon", className: "save-icon icon", id: "searchbox_save" }, __(StarIcon, {
                        color: iconColor,
                        onClick: () => this.props.onSaveAsQuery(prompt("Save query as") || "query", FinderQuery.fromCombinedTermsAndQueries(this.props.searchedTerms, this.props.searchedQueries)),
                    })),

                    _.div({ key: "search-icon", className: "search-icon icon", id: "searchbox_search" },
                        this.props.searching
                            ? __(CircularProgress, { size: 24 })
                            : __(SearchIcon, { color: iconColor, onClick: () => this.props.onEnter(null) }),
                    ),
                ]),
            ]),
            __(Dialog, { // Dialog to display the date (range) selector.
                key: "dialog",
                actions: dialogButtons,
                open: this.state.calendarOpen || false,
                onRequestClose: this.handleCloseDialog.bind(this),
                contentStyle: { width: "365px" },
                contentClassName: "searchbox-datepicker-dialog",
            },
                __(Flatpickr.default, {
                    key: "flatpikr",
                    options: {
                        inline: true,
                        mode: this.state.calendarMode,
                        locale: this.props.translations && this.props.translations[DATEPICKERLOCALE] || DATEPICKERDEFAULT,
                    },
                    onChange: this.handleDateSelection.bind(this),
                }),
            ),
        ]);

    }

}

type Autocomplete_t = {
    value: string,
    onChange: (ev: any) => void,
    onKeyUp: (ev: any) => void,
    onFocus: () => void,
    translations?: any,
    open: boolean,
    focusAutocomplete: boolean,
    suggestions: string[],
    onSuggestionClick: (suggestion: string) => void,
    onDismiss: () => void,
    onRequestAutocomplete: () => void,
};

class SearchboxAutocomplete extends Component<Autocomplete_t, {}> {
    private root: HTMLDivElement;
    private inputElem: HTMLInputElement;
    private menu: Menu;
    constructor(props: Autocomplete_t) {
        super(props);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
    }

    public componentDidMount() {
        document.addEventListener("mouseup", this.handleOutsideClick);
        document.addEventListener("touchstart", this.handleOutsideClick);
    }

    public componentWillUnmount() {
        document.removeEventListener("mouseup", this.handleOutsideClick);
        document.removeEventListener("touchstart", this.handleOutsideClick);
    }

    private handleOutsideClick(e: any) {
        if (this.props.open) {
            if (this.root.contains(e.target) || (e.button && e.button !== 0)) {
                return;
            }
            this.props.onDismiss();
            e.stopPropagation();
            e.preventDefault();
        }

    }

    private handleKeyUp(e: any) {
        switch (e.keyCode) {
            case 40: // ARROWKEY_DOWN
                if (this.menu) {
                    this.props.onRequestAutocomplete();
                    (<any>this.menu).setFocusIndex(e, 0, true);
                }
                break;
            case 27: //ESC
                this.handleDismiss();
                break;
            default:
        }

        this.props.onKeyUp(e);
    }

    private handleDismiss() {
        if (this.props.focusAutocomplete && this.inputElem) {
            this.inputElem.focus();
        }
        this.props.onDismiss();
    }
    private getPlaceHolder() {
        const translated: string | undefined = this.props.translations ? this.props.translations[PLACEHOLDERTRANSLATION] : undefined;
        return translated ? translated : PLACEHOLDERDEFAULT;
    }
    public render() {
        return _.div({
            className: "searchbox-input-wrapper",
            ref: (ref: any) => { this.root = ref; },
        }, [
                _.input({
                    value: this.props.value,
                    key: "input",
                    id: "searchbox",
                    placeholder: this.getPlaceHolder(),
                    onChange: this.props.onChange,
                    onKeyUp: this.handleKeyUp.bind(this),
                    onFocus: this.props.onFocus,
                    ref: input => { this.inputElem = <HTMLInputElement>input; },
                }),
                __(Paper, {
                    className: "searchbox-autocomplete",
                    style: {
                        display: this.props.open && this.props.suggestions.length > 0 ? "block" : "none",
                    },
                }, __(Menu, {
                    ref: (menu) => { this.menu = <Menu>menu; },
                    width: "100%",
                    autoWidth: false,
                    maxHeight: <any>"80vh",
                    disableAutoFocus: !this.props.focusAutocomplete,
                    initiallyKeyboardFocused: true,
                    desktop: true,
                    onEscKeyDown: this.handleDismiss.bind(this),
                    listStyle: {
                        display: "block",
                    },
                    onChange: (event: any, item: string) => {
                        if (this.inputElem) {
                            this.inputElem.focus();
                        }
                        const timeo = setInterval(() => {
                            let elem = document.getElementById("searchbox");
                            if (elem) {
                                clearInterval(timeo);
                                elem.focus();
                            }
                        }, 10);
                        this.props.onSuggestionClick(item);
                    },
                }, this.props.suggestions.map((option, i) => __(MenuItem, {
                    key: i,
                    value: option,
                    primaryText: option,
                })),
                    ),
                ),
            ]);
    }
}

type AutocompleteSearchBox_State_t = {
    autocompleteText?: string,
    autocompleteTimer?: any,
    autocompleteTerms?: Term_t[],
};

export type AutocompleteSearchBox_t = SearchBox_t & {
    fetchAutocomplete: (text: string) => Promise<Term_t[]>,
};

export class AutocompleteSearchBox extends Component<AutocompleteSearchBox_t, AutocompleteSearchBox_State_t> {
    private onInputChanged: (text: string) => void;
    constructor(props: AutocompleteSearchBox_t) {
        super(props);
        this.state = {
            autocompleteText: "",
            autocompleteTimer: null,
            autocompleteTerms: [],
        };

        this.onInputChanged = (text: string) => {
            this._onInputChanged(text);
            this.props.onInputChanged(text);
        };
    }

    private _onInputChanged(text: string) {
        this.setState((prevState: AutocompleteSearchBox_State_t, props: AutocompleteSearchBox_t) => {
            if(prevState.autocompleteTimer) {
                clearTimeout(prevState.autocompleteTimer);
            }

            let timer = setTimeout(() => {
                props.fetchAutocomplete(text).then((terms: Term_t[]) => {
                    this.setState({
                        autocompleteTerms: terms,
                    });
                });
            }, 200);
            return Object.assign({}, prevState, { autocompleteText: text, autocompleteTimer: timer });
        });
    }

    public render() {
        let props = Object.assign({}, this.props, {
            onInputChanged: this.onInputChanged,
            autocompleteTerms: (this.props.autocompleteTerms || []).concat(this.state.autocompleteTerms || []),
        });
        delete props.fetchAutocomplete;

        return __(SearchBox, <SearchBox_t>props);
    }
}
