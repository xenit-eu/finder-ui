import * as debug from "debug";
import { Menu, MenuItem, Paper, Popover } from "material-ui";
import Chip from "material-ui/Chip";
import CircularProgress from "material-ui/CircularProgress";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import * as Colors from "material-ui/styles/colors";
import SearchIcon from "material-ui/svg-icons/action/search";
import StarIcon from "material-ui/svg-icons/toggle/star-border";

declare var require: any;
// tslint:disable-next-line:no-var-requires
const Flatpickr = require("react-flatpickr");

import { Component, createElement as __, KeyboardEvent, ReactElement } from "react";
import * as _ from "react-dom-factories";

import "react-flatpickr/node_modules/flatpickr/dist/themes/material_blue.css";
import { SimpleDateRange } from "./DateRange";
import {
    DateFillinValueMatch, DateHandleRequired, DateRangeFillinValueMatch, IAutocompleteSuggestion, ISimpleSearchableQueryElement, SimpleSearchQueryElementValueMatch,
} from "./searchables";
import "./searchbox.less";
import {
    ISimpleSearchQueryElement,
} from "./searchquery";

const d = debug("finder-ui:search:searchBox");

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
    searchedQueryElements: ISimpleSearchQueryElement[],
    customButtons?: Array<ReactElement<any>>,              // list of custom buttons to add besides search and save icons
    translations?: any,
    updateChipsOnConstruction?: boolean,
    autocompleteSuggestions: IAutocompleteSuggestion[],
};

export type SearchBox_actions_t = {
    onRemoveQueryElement: (idx: number) => void,            // remove existing term.
    onAddQueryElement: (element: ISimpleSearchQueryElement) => void,           // add new term or start search (when parameter is null)
    onSearch: () => void,
    onInputChanged: (text: string) => void,         // called on any changes in the input box.
    onSaveAsQuery: (name: string, query: ISimpleSearchQueryElement[]) => void,          // called on request to save the current query as a new saved query.
    onChipsUpdated?: () => void,
    onDidUpdate?: () => void,
};
export type SearchBox_t = SearchBox_actions_t & SearchBox_data_t;
type State_t = {
    textValue: string,
    suggestionsOpened: boolean,
    focusSuggestions: boolean,
    currentValueMatchWaitingForCalendar: DateFillinValueMatch | DateRangeFillinValueMatch | undefined,
    currentChipVMs: ChipVM[],
};
class ChipVM {
    constructor(
        public tooltipText: string,
        public searchbarText: string,
        public index: number,
        public backgroundColor: string,
        public deletable: boolean) { }
}

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
            currentChipVMs: [],
        };
        if (props.updateChipsOnConstruction) {
            this.updateChips(props.searchedQueryElements);
        }
    }
    public componentWillReceiveProps(nextProps: SearchBox_t) {
        this.updateChips(nextProps.searchedQueryElements);
    }
    private isCalendarOpen() {
        return !!this.state.currentValueMatchWaitingForCalendar;
    }

    private getCalendarMode(): DateHandleRequired {
        const currentVMWFC = this.state.currentValueMatchWaitingForCalendar;
        return currentVMWFC ? currentVMWFC.requiredDateHandle() : DateHandleRequired.none;
    }

    public handleCloseDialog() {
        const valueMatchWaiting = this.state.currentValueMatchWaitingForCalendar;
        if (!valueMatchWaiting) {
            return;
        }
        if (valueMatchWaiting instanceof DateRangeFillinValueMatch) {
            this.setState({ currentValueMatchWaitingForCalendar: undefined });
            this.addNewQueryElement(valueMatchWaiting.onFillIn(new SimpleDateRange(this.selectedDates[0], this.selectedDates[1])));
            return;
        }
        if (valueMatchWaiting instanceof DateFillinValueMatch) {
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

    public onApplyAutocompleteSuggestion(suggestion: IAutocompleteSuggestion) {
        const key = suggestion.FillInKeyIfSelected();
        const value = suggestion.FillInValueIfSelected();
        this.onApplyTextSuggestion({ key, value });
    }

    public onApplyTextSuggestion({ key, value }: { key: string, value: string }) {
        const toTest = this.props.searchableQueryElements;
        return Promise.all(toTest.map(t => t.matchKeyValue(key, value)))
            .then(matches => {
                return matches.filter(p => p.hasResult())[0];
            })
            .then(match => {
                if (!match) {
                    return;
                }
                if (match instanceof SimpleSearchQueryElementValueMatch) {
                    this.addNewQueryElement(match.simpleSearchQueryElement);
                    return;
                }
                if (match instanceof DateRangeFillinValueMatch || match instanceof DateFillinValueMatch) {
                    this.setState({ currentValueMatchWaitingForCalendar: match });
                    return;
                }
                throw new Error("Unhandled type, should be one of the four existing types");
            });
    }
    private getCurrentKeyValue() {
        return getKeyValue(this.state.textValue);
    }

    private hideSuggestions() {
        this.setState({ suggestionsOpened: false, focusSuggestions: false });
    }
    public handleInputChange(evt: KeyboardEvent<HTMLInputElement>) {
        const target = evt.target as HTMLInputElement;
        this.inputChanged(target.value);
    }

    public handleInputKey(evt: KeyboardEvent<HTMLInputElement>): void {
        const input = evt.target as HTMLInputElement;
        if (evt.keyCode === 13) {
            if (!input.value) { // Enter press with empty input => call onEnter with null.
                this.props.onSearch();
                return;
            }
            this.onApplyTextSuggestion(getKeyValue(input.value));
            this.hideSuggestions();
            return;
        }
        this.inputChanged(input.value);
    }

    public inputChanged(t: string) {
        this.setState({ textValue: t, suggestionsOpened: t.length > 0 });
        if (this.props.onInputChanged) {
            this.props.onInputChanged(t);
        }
    }

    public handleDateSelection(selected: Date[]) {
        this.selectedDates = selected;
    }

    private withTooltip(label: string, tooltip: string): ReactElement<any> {
        return _.span({ title: tooltip }, label);
    }
    private SearchQueryElementToChipVM(sQE: ISimpleSearchQueryElement, index: number) {
        return Promise.all([sQE.getTooltipText(), sQE.getSimpleSearchbarText()]).then(texts =>
            new ChipVM(texts[0], texts[1], index, sQE.isReferential() ? Colors.blue100 : Colors.grey200, sQE.isRemovable()));
    }
    private ChipVMToChip(chipVM: ChipVM) {
        return __(Chip, {
            className: "searchbox-chip",
            backgroundColor: chipVM.backgroundColor,
            key: "Q" + chipVM.index,
            onRequestDelete: chipVM.deletable ? () => this.props.onRemoveQueryElement(chipVM.index) : undefined,
        }, this.withTooltip(chipVM.searchbarText, chipVM.tooltipText));
    }
    private updateChips(queryElements: ISimpleSearchQueryElement[]) {
        return Promise.all(queryElements.map((sQE, i) => this.SearchQueryElementToChipVM(sQE, i)))
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
        const filteredSuggestionsList: IAutocompleteSuggestion[] = this.props.autocompleteSuggestions || [];

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
                    value: this.state.textValue as string,
                    onChange: this.handleInputChange.bind(this),
                    onKeyUp: this.handleInputKey.bind(this),
                    onFocus: () => this.setState({ focusSuggestions: false }),
                    open: this.state.suggestionsOpened,
                    focusAutocomplete: this.state.focusSuggestions,
                    suggestions: filteredSuggestionsList,
                    onSuggestionClick: (suggestion: IAutocompleteSuggestion) => this.onApplyAutocompleteSuggestion(suggestion),
                    onDismiss: () => this.hideSuggestions(),
                    onRequestAutocomplete: () => this.setState({ suggestionsOpened: true, focusSuggestions: true }),
                    translations: this.props.translations,
                }),
                _.div({ className: "searchbox-icon-wrapper" }, [

                    ...(this.props.customButtons || []),

                    _.div({ key: "save-icon", className: "save-icon icon", id: "searchbox_save" }, __(StarIcon, {
                        color: iconColor,
                        onClick: () => this.props.onSaveAsQuery(prompt("Save query as") || "query", this.props.searchedQueryElements),
                    })),

                    _.div({ key: "search-icon", className: "search-icon icon", id: "searchbox_search" },
                        this.props.searching
                            ? __(CircularProgress, { size: 24 })
                            : __(SearchIcon, { color: iconColor, onClick: () => this.props.onSearch() }),
                    ),
                ]),
            ]),
            this.isCalendarOpen() && __(Dialog, { // Dialog to display the date (range) selector.
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
                        mode: this.getCalendarMode() === DateHandleRequired.range ? "range" : "single",
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
    suggestions: IAutocompleteSuggestion[],
    onSuggestionClick: (suggestion: IAutocompleteSuggestion) => void,
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
                    (this.menu as any).setFocusIndex(e, 0, true);
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
                    ref: input => { this.inputElem = input as HTMLInputElement; },
                }),
                __(AutocompleteMenu, {
                    key: "autocomplete-menu",
                    open: this.props.open,
                    onFocusInput: () => this.inputElem.focus(),
                    focusAutocomplete: this.props.focusAutocomplete,
                    suggestions: this.props.suggestions,
                    onSuggestionClick: this.props.onSuggestionClick,
                    onDismiss: this.handleDismiss.bind(this),
                    menuRef: (menu: any) => { this.menu = menu; },
                }),
            ]);
    }
}

type AutocompleteMenu_Props_t = {
    open: boolean,
    onFocusInput: () => void,
    focusAutocomplete: boolean,
    suggestions: IAutocompleteSuggestion[],
    onSuggestionClick: (suggestion: IAutocompleteSuggestion) => void,
    onDismiss: () => void,
    menuRef: any;
};

class AutocompleteMenu extends Component<AutocompleteMenu_Props_t> {
    public shouldComponentUpdate(nextProps: AutocompleteMenu_Props_t) {
        if (nextProps.focusAutocomplete !== this.props.focusAutocomplete) {
            return true;
        }
        if (nextProps.suggestions.length !== this.props.suggestions.length) {
            return true;
        }

        if (nextProps.open !== this.props.open) {
            return true;
        }

        for (let i = 0; i < this.props.suggestions.length; i++) {
            if (nextProps.suggestions[i].DisplayKey() !== this.props.suggestions[i].DisplayKey()) {
                return true;
            } else if (nextProps.suggestions[i].DisplayValue() !== this.props.suggestions[i].DisplayValue()) {
                return true;
            }
        }

        return false;
    }
    public render() {
        return __(Paper, {
            className: "searchbox-autocomplete",
            style: {
                display: this.props.open && this.props.suggestions.length > 0 ? "block" : "none",
            },
        },
            __(Menu, {
                ref: this.props.menuRef,
                width: "100%",
                autoWidth: false,
                maxHeight: "80vh" as any,
                disableAutoFocus: !this.props.focusAutocomplete,
                initiallyKeyboardFocused: true,
                desktop: true,
                onEscKeyDown: this.props.onDismiss,
                listStyle: {
                    display: "block",
                },
                onChange: (event: any, item: IAutocompleteSuggestion) => {
                    this.props.onFocusInput();
                    const timeo = setInterval(() => {
                        const elem = document.getElementById("searchbox");
                        if (elem) {
                            clearInterval(timeo);
                            elem.focus();
                        }
                    }, 10);
                    this.props.onSuggestionClick(item);
                },
            }, this.props.suggestions.filter(uniqueSuggestionsFilter).map((option) => __(MenuItem, {
                key: option.DisplayKey() + "-" + option.DisplayValue(),
                value: option,
                primaryText: option.DisplayKey() + ":" + option.DisplayValue(),
            })),
            ),
        );
    }
}

function uniqueSuggestionsFilter(suggestion: IAutocompleteSuggestion, i: number, suggestions: IAutocompleteSuggestion[]): boolean {
    const firstIndex = suggestions.findIndex(sug => sug.DisplayKey() === suggestion.DisplayKey() && sug.DisplayValue() === suggestion.DisplayValue());
    return i === firstIndex;
}

type AutocompleteSearchBox_State_t = {
    autocompleteText?: string,
    currentSuggestions?: IAutocompleteSuggestion[],
};

export type AutocompleteSearchBox_t = SearchBox_t;

export class AutocompleteSearchBox extends Component<AutocompleteSearchBox_t, AutocompleteSearchBox_State_t> {
    private onInputChanged: (text: string) => void;

    private autocompleteTimer: any = null;

    constructor(props: AutocompleteSearchBox_t) {
        super(props);
        this.state = {
            autocompleteText: "",
            currentSuggestions: [],
        };

        this.onInputChanged = (text: string) => {
            this._onInputChanged(text);
            this.props.onInputChanged(text);
        };
    }
    protected getAutocompleteList(text: string): Promise<IAutocompleteSuggestion[]> {
        const currentKeyValue = getKeyValue(text);
        const autocompletionsP = Promise.all(this.props.searchableQueryElements.map(p => p.getPartiallyMatchingAutocompleteListElements(currentKeyValue.key, currentKeyValue.value)));
        return autocompletionsP.then(autocompletions => flatten(autocompletions));
    }

    private _onInputChanged(text: string) {
        if (this.autocompleteTimer) {
            clearTimeout(this.autocompleteTimer);
        }

        this.autocompleteTimer = setTimeout(() => {
            this.autocompleteTimer = null;
            return this.getAutocompleteList(text).then(autoCompleteList => {
                this.setState({ currentSuggestions: autoCompleteList });
            });
        }, 200);

        this.setState({ autocompleteText: text });
    }

    public render() {
        const props = Object.assign({}, this.props, {
            onInputChanged: this.onInputChanged,
            autocompleteSuggestions: this.state.currentSuggestions || [],
        });
        return __(SearchBox, props as SearchBox_t);
    }
}
