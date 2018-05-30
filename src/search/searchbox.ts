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
import debug = require("debug");

declare var require: any;
// tslint:disable-next-line:no-var-requires
const Flatpickr = require("react-flatpickr");

import { Component, createElement as __, DOM as _, KeyboardEvent, ReactElement } from "react";

import "react-flatpickr/node_modules/flatpickr/dist/themes/material_blue.css";
import { SimpleDateRange } from "./DateRange";
import {
    DateFillinValueMatch, DateRangeFillinValueMatch, IAutocompleteListElement, ISimpleSearchableQueryElement,
} from "./searchables";
import "./searchbox.less";
import {
    ISimpleSearchQueryElement, SimpleSearchQuery,
} from "./searchquery";

const d = debug("finder-ui:SearchBox");

export function flatten<T>(elements: T[][]) {
    let ret: T[] = [];
    elements.forEach((t: T[]) => ret = ret.concat(t));
    return ret;
}

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

function toDateString(date: Date): string {
    return new Date(date.getTime() + (5 * 3600 * 1000)).toISOString().substring(0, 10);
}

export const ValueNoKeyTerm = "ValueNoKeyTerm";
export const PLACEHOLDERTRANSLATION = "PLACEHOLDERTRANSLATION";
export const PLACEHOLDERDEFAULT = "Type search term/query or 'Enter' to start searching...";
export const DATEPICKERLOCALE = "DATEPICKERLOCALE";
export const DATEPICKERDEFAULT = {};

export type SearchBox_data_t = {
    searching: boolean,                             // flag indicating that search process is busy => activate spinner !
    searchableQueryElements: ISimpleSearchableQueryElement[],            // suggestions to be proposed on the drop-down list.
    customButtons?: Array<ReactElement<any>>,              // list of custom buttons to add besides search and save icons
    translations?: any,
    updateChipsOnConstruction?: boolean,
};

export type SearchBox_actions_t = {
    onRemoveQueryElement: (idx: number) => void,            // remove existing term.
    onAddQueryElement: (element: ISimpleSearchQueryElement) => void,           // add new term or start search (when parameter is null)
    registerQueryElementsListener: (handle: () => void) => void, // Notification from the outside.
    getQueryElements: () => ISimpleSearchQueryElement[],
    onSearch: () => void,
    onInputChanged: (text: string) => void,         // called on any changes in the input box.
    onSaveAsQuery: (name: string, query: SimpleSearchQuery) => void,          // called on request to save the current query as a new saved query.
    onChipsUpdated?: () => void,
    onDidUpdate?: () => void,
};
export type SearchBox_t = SearchBox_actions_t & SearchBox_data_t;
type State_t = {
    textValue?: string,
    suggestionsOpened?: boolean,
    focusSuggestions?: boolean,
    currentValueMatchWaitingForCalendar: DateFillinValueMatch | DateRangeFillinValueMatch | undefined,
    currentSuggestions: IAutocompleteListElement[],
    currentChipVMs: ChipVM[],
};
class ChipVM {
    constructor(
        public tooltipText: string,
        public searchbarText: string,
        public index: number,
        public backgroundColor: string) { }
}
//@Component SearchBox
//@ComponentDescription "Input box allowing the search by terms (node name, creator, ...)."
//@Method SearchBox Returns ReactComponent
//@MethodDescription "SearchBox({param1: value1, param2: value2, ...})"
//@Param onEnter (text:string)=>void "callback called when a new text (eventually a term) has been entered."
//@Param onInputChanged (text:string)=>void ""
//@Param onRemove (idx:number)=>void "callback calleflatten an existing term."
//@Param searching boolean "flag indicating that seaflatten is busy => activate spinner !"
//@Param searchableTerms SearchableTerm_t[] "suggestflattenproposed on the drop-down list when entering a term name."
//@Param terms Term_t[] "list of existing terms alreflattened for search."

export class SearchBox extends Component<SearchBox_t, State_t> {

    private inputElem: HTMLInputElement | null;
    private selectedDates: Date[] = [];

    constructor(props: SearchBox_t) {
        super(props);
        this.state = {
            textValue: "",
            currentValueMatchWaitingForCalendar: undefined,
            suggestionsOpened: false,
            focusSuggestions: false,
            currentSuggestions: [],
            currentChipVMs: [],
        };
        const that = this;
        props.registerQueryElementsListener(() => that.updateChips());
        if (props.updateChipsOnConstruction) {
            that.updateChips();
        }
    }

    private isCalendarOpen() {
        return !!this.state.currentValueMatchWaitingForCalendar;
    }

    private getCalendarMode(): "range" | "single" | undefined {
        const currentVMWFC = this.state.currentValueMatchWaitingForCalendar;
        return currentVMWFC ? (currentVMWFC.type === "DateRangeFillinValueMatch" ? "range" : "single") : undefined;
    }

    public handleCloseDialog() {
        const valueMatchWaiting = this.state.currentValueMatchWaitingForCalendar;
        if (!valueMatchWaiting) {
            return;
        }
        if (valueMatchWaiting.type === "DateRangeFillinValueMatch") {
            this.setState({ currentValueMatchWaitingForCalendar: undefined });
            this.addNewQueryElement(valueMatchWaiting.onFillIn(new SimpleDateRange(this.selectedDates[0], this.selectedDates[1])));
            return;
        }
        if (valueMatchWaiting.type === "DateFillinValueMatch") {
            this.setState({ currentValueMatchWaitingForCalendar: undefined });
            this.addNewQueryElement(valueMatchWaiting.onFillIn(this.selectedDates[0]));
            return;
        }
    }

    public addNewQueryElement(queryElement: ISimpleSearchQueryElement) {
        this.props.onAddQueryElement(queryElement);
        this.setState({ textValue: "" });
        this.hideSuggestions();
    }

    public onApplyAutocompleteSuggestion(suggestion: IAutocompleteListElement) {
        const key = suggestion.FillInKeyIfSelected();
        const value = suggestion.FillInValueIfSelected();
        this.onApplyTextSuggestion({ key, value });
    }

    public onApplyTextSuggestion({ key, value }: { key: string, value: string }) {
        const toTest = this.props.searchableQueryElements;
        return Promise.all(toTest.map(t => t.MatchKeyValue(key, value)))
            .then(matches => {
                return matches.filter(p => p.type !== "NoResultValueMatch")[0];
            })
            .then(match => {
                if (!match) {
                    return;
                }
                if (match.type === "SimpleSearchQueryElementValueMatch") {
                    this.addNewQueryElement(match.simpleSearchQueryElement);
                    return;
                }
                if (match.type === "DateRangeFillinValueMatch" || match.type === "DateFillinValueMatch") {
                    this.setState({ currentValueMatchWaitingForCalendar: match });
                    return;
                }
                d("Unhandled type, should be one of the four existing types");
                throw "Unhandled type";
            });
    }
    private getCurrentKeyValue() {
        return this.getKeyValue(this.state.textValue);
    }
    private getKeyValue(s: string | undefined): { key: string, value: string } {
        if (!s) {
            return { key: "", value: "" };
        }
        const splits = s.split(":");
        if (splits.length >= 2) {
            return { key: splits[0], value: splits[1] };
        }
        return { key: "", value: splits[0] };
    }
    private getAutocompleteList(): Promise<IAutocompleteListElement[]> {
        const currentKeyValue = this.getCurrentKeyValue();
        const autocompletionsP = Promise.all(this.props.searchableQueryElements.map(p => p.getPartiallyMatchingAutocompleteListElements(currentKeyValue.key, currentKeyValue.value)));
        return autocompletionsP.then(autocompletions => flatten(autocompletions));
    }

    private hideSuggestions() {
        this.setState({ suggestionsOpened: false, focusSuggestions: false });
    }
    public updateAutocompletes() {
        return this.getAutocompleteList().then(autoCompleteList => {
            this.setState({ currentSuggestions: autoCompleteList });
        });
    }
    public handleInputChange(evt: KeyboardEvent<HTMLInputElement>) {
        const target = <HTMLInputElement>evt.target;
        this.inputChanged(target.value);
    }

    public handleInputKey(evt: KeyboardEvent<HTMLInputElement>): void {
        const input = <HTMLInputElement>evt.target;
        if (evt.keyCode === 13) {
            if (!input.value) { // Enter press with empty input => call onEnter with null.
                this.props.onSearch();
            }
            this.onApplyTextSuggestion(this.getKeyValue(input.value));
            this.hideSuggestions();
            this.updateAutocompletes();
            return;
        }
        this.inputChanged(input.value);
    }

    public inputChanged(t: string) {
        this.setState({ textValue: t, suggestionsOpened: t.length > 0 });
        if (this.props.onInputChanged) {
            this.props.onInputChanged(t);
        }
        this.updateAutocompletes();
    }

    public handleDateSelection(selected: Date[]) {
        this.selectedDates = selected;
    }

    private withTooltip(label: string, tooltip: string): ReactElement<any> {
        return _.span({ title: tooltip }, label);
    }
    private SearchQueryElementToChipVM(sQE: ISimpleSearchQueryElement, index: number) {
        return Promise.all([sQE.getTooltipText(), sQE.getSimpleSearchbarText()]).then(texts =>
            new ChipVM(texts[0], texts[1], index, sQE.isReferential ? Colors.blue100 : Colors.white));
    }
    private ChipVMToChip(chipVM: ChipVM) {
        let me = this;
        return __(Chip, {
            className: "searchbox-chip",
            backgroundColor: chipVM.backgroundColor,
            key: "Q" + chipVM.index,
            onRequestDelete: () => me.props.onRemoveQueryElement(chipVM.index),
        }, this.withTooltip(chipVM.searchbarText, chipVM.tooltipText));
    }
    private updateChips() {
        return Promise.all(this.props.getQueryElements().map((sQE, i) => this.SearchQueryElementToChipVM(sQE, i)))
            .then(chipVMs => this.setState({ currentChipVMs: chipVMs }))
            .then(() => {
                if (this.props.onChipsUpdated) {
                    this.props.onChipsUpdated();
                }
            });
    }
    public componentDidUpdate() {
        if (this.props.onDidUpdate) {
            this.props.onDidUpdate();
        }
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

        const filteredSuggestionsList: IAutocompleteListElement[] = this.state.currentSuggestions;

        const defaultChip = (this.state.currentChipVMs.length === 0) ? __(Chip, {
            className: "searchbox-chip searchbox-chip-default",
            key: "Default",
        }, "All:*") : undefined;
        const currentChips = this.state.currentChipVMs.map((c) => this.ChipVMToChip(c));
        return _.div({ key: "search-box", className: "search-box" }, [
            defaultChip,
            ...currentChips,
            _.div({ className: "searchbox-input-area" }, [
                __(SearchboxAutocomplete, {
                    value: <string>this.state.textValue,
                    onChange: this.handleInputChange.bind(this),
                    onKeyUp: this.handleInputKey.bind(this),
                    onFocus: () => this.setState({ focusSuggestions: false }),
                    open: <boolean>this.state.suggestionsOpened,
                    focusAutocomplete: <boolean>this.state.focusSuggestions,
                    suggestions: filteredSuggestionsList,
                    onSuggestionClick: (suggestion: IAutocompleteListElement) => this.onApplyAutocompleteSuggestion(suggestion),
                    onDismiss: () => this.hideSuggestions(),
                    onRequestAutocomplete: () => this.setState({ suggestionsOpened: true, focusSuggestions: true }),
                    translations: this.props.translations,
                }),
                _.div({ className: "searchbox-icon-wrapper" }, [

                    ...(this.props.customButtons || []),

                    _.div({ key: "save-icon", className: "save-icon icon", id: "searchbox_save" }, __(StarIcon, {
                        color: iconColor,
                        onClick: () => this.props.onSaveAsQuery(prompt("Save query as") || "query", new SimpleSearchQuery(this.props.getQueryElements())),
                    })),

                    _.div({ key: "search-icon", className: "search-icon icon", id: "searchbox_search" },
                        this.props.searching
                            ? __(CircularProgress, { size: 24 })
                            : __(SearchIcon, { color: iconColor, onClick: () => this.props.onSearch() }),
                    ),
                ]),
            ]),
            __(Dialog, { // Dialog to display the date (range) selector.
                key: "dialog",
                actions: dialogButtons,
                open: this.isCalendarOpen() || false,
                onRequestClose: this.handleCloseDialog.bind(this),
                contentStyle: { width: "365px" },
                contentClassName: "searchbox-datepicker-dialog",
            },
                __(Flatpickr.default, {
                    key: "flatpikr",
                    options: {
                        inline: true,
                        mode: this.isCalendarOpen(),
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
    suggestions: IAutocompleteListElement[],
    onSuggestionClick: (suggestion: IAutocompleteListElement) => void,
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
                    onChange: (event: any, item: IAutocompleteListElement) => {
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
                    primaryText: option.DisplayKey() + ":" + option.DisplayValue(),
                })),
                    ),
                ),
            ]);
    }
}

type AutocompleteSearchBox_State_t = {
    autocompleteText?: string,
    autocompleteTimer?: any,
    searchableQueryElements?: ISimpleSearchableQueryElement[],
};

export type AutocompleteSearchBox_t = SearchBox_t & {
    fetchAutocomplete: (text: string) => Promise<ISimpleSearchableQueryElement[]>,
};

export class AutocompleteSearchBox extends Component<AutocompleteSearchBox_t, AutocompleteSearchBox_State_t> {
    private onInputChanged: (text: string) => void;
    constructor(props: AutocompleteSearchBox_t) {
        super(props);
        this.state = {
            autocompleteText: "",
            autocompleteTimer: null,
            searchableQueryElements: [],
        };

        this.onInputChanged = (text: string) => {
            this._onInputChanged(text);
            this.props.onInputChanged(text);
        };
    }

    private _onInputChanged(text: string) {
        this.setState((prevState: AutocompleteSearchBox_State_t, props: AutocompleteSearchBox_t) => {
            if (prevState.autocompleteTimer) {
                clearTimeout(prevState.autocompleteTimer);
            }

            let timer = setTimeout(() => {
                props.fetchAutocomplete(text).then((terms: ISimpleSearchableQueryElement[]) => {
                    this.setState({
                        searchableQueryElements: terms,
                    });
                });
            }, 200);
            return Object.assign({}, prevState, { autocompleteText: text, autocompleteTimer: timer });
        });
    }

    public render() {
        let props = Object.assign({}, this.props, {
            onInputChanged: this.onInputChanged,
            searchableQueryElements: (this.props.searchableQueryElements || []).concat(this.state.searchableQueryElements || []),
        });
        delete props.fetchAutocomplete;

        return __(SearchBox, <SearchBox_t>props);
    }
}
