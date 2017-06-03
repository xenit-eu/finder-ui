import Chip from "material-ui/Chip";
import CircularProgress from "material-ui/CircularProgress";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import RefreshIndicator from "material-ui/RefreshIndicator";
import SearchIcon from "material-ui/svg-icons/action/search";

declare var require: any;
// tslint:disable-next-line:no-var-requires
const Flatpickr = require("react-flatpickr");

import { Component, createElement as __, DOM as _, KeyboardEvent, ReactElement } from "react";

import "flatpickr/dist/themes/material_blue.css";
import "./searchbox.less";

const DAY: number = 24 * 3600 * 1000;
const MIN_DATE: Date = new Date(1970, 1, 1);
const MAX_DATE: Date = new Date(3000, 1, 1);

const searchIconStyle = {
    position: "relative",
    top: "-12px",
    left: "10px",
};

const iconColor = "#512e5f";

const reNameValue = /\w+\s*\:\s*\w+/;

function toDateString(d: Date): string {
    return new Date(d.getTime() + (5 * 3600 * 1000)).toISOString().substring(0, 10);
}

function addMonths(d: Date, months: number): Date {
    let result = new Date(d);
    result.setMonth(result.getMonth() + months);
    return result;
}

function addDays(d: Date, days: number): Date {
    return new Date(d.getTime() + (days * DAY));
}

export type SearchableTerm_t = {
    name: string,
    label: string,
    type: string, // "text" | "enum" | "date"
    values: string[],
};

//@Type  "Term structure"
//@TypeDescription  "Term structure"
export type Term_t = {
    name: string, //@TypeParam internal name of the term
    label: string, //@TypeParam displayable name of the term
    value: string, //@TypeParam value entered for this term
};

export type SearchBox_t = {
    searching: boolean,                     // flag indicating that search process is busy => activate spinnger !
    terms: Term_t[],                        // list of existing terms already requested for search.
    searchableTerms: SearchableTerm_t[],    // suggestions to be proposed on the drop-down list.
    onRemove: (idx: number) => void,        // remove existing term.
    onEnter: (text: Term_t|null) => void,        // add new term.
    onInputChanged: (text: string) => void,
};

type State_t = {
    suggestionList?: string[],
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

    private textInput: HTMLInputElement;
    private currentTerm: SearchableTerm_t;
    private selectedDates: Date[] = [];

    constructor(props: SearchBox_t) {
        super(props);
        this.state = {
            suggestionList: props.searchableTerms.map(t => t.label + ":"),
            calendarOpen: false,
            calendarMode: "single",
        };
    }

    public resetSuggestionList() {
        this.setState({ suggestionList: this.props.searchableTerms.map(t => t.label + ":") });
    }

    public addNewTerm(term: Term_t) {
        this.props.onEnter(term);
        this.textInput.value = "";
        this.resetSuggestionList();
    }

    public handleInputChange(event: KeyboardEvent) {
        const input: HTMLInputElement = <HTMLInputElement> event.target;
        const val = input.value;

        this.currentTerm = this.props.searchableTerms.filter(t => new RegExp("^\\s*" + t.label + "\\s*\\:", "i").test(val))[0];

        if (val.endsWith(":on...") || val.endsWith(":after...") || val.endsWith(":before...")) {
            this.setState({ calendarOpen: true, calendarMode: "single" });
        } else if (val.endsWith(":between...")) {
            this.setState({ calendarOpen: true, calendarMode: "range" });
        } else if (val.endsWith(":today")) {
            if (this.currentTerm && this.currentTerm.type === "date") {
                this.addNewTerm({ name: this.currentTerm.name, label: this.currentTerm.label, value: toDateString(new Date()) + ".." + toDateString(new Date()) });
            }
        } else if (val.endsWith(":last week")) {
            if (this.currentTerm && this.currentTerm.type === "date") {
                this.addNewTerm({ name: this.currentTerm.name, label: this.currentTerm.label, value: toDateString(addDays(new Date(), -7)) + ".." + toDateString(new Date()) });
            }
        } else if (val.endsWith(":last month")) {
            if (this.currentTerm && this.currentTerm.type === "date") {
                this.addNewTerm({ name: this.currentTerm.name, label: this.currentTerm.label, value: toDateString(addMonths(new Date(), -1)) + ".." + toDateString(new Date()) });
            }
        } else if (this.currentTerm && this.currentTerm.type === "date") {
            this.setState({ suggestionList: ["today", "last week", "last month", "on...", "after...", "before...", "between..."].map(t => val + (val.endsWith(":") ? "" : ": ") + t) });
        } else if (this.currentTerm && this.currentTerm.type === "enum") {
            if (val.endsWith(":")) {
                this.setState({ suggestionList: this.currentTerm.values.map(t => val + t) });
            } else {
                const match = /[^\:]+\:\s*(.*)\s*$/.exec(val);
                if (match && this.currentTerm.values.includes(match[1])) {
                    this.addNewTerm({ name: this.currentTerm.name, label: this.currentTerm.label, value: match[1] });
                }
            }
        } else {
            this.resetSuggestionList();
        }
    }

    public handleInputKey(evt: KeyboardEvent): void {
        const input = <HTMLInputElement> this.textInput;
        if (evt.keyCode === 13 && (!input.value || reNameValue.test(input.value))) {
            if (!input.value) { // Enter press with empty input => call onEnter with null.
                this.props.onEnter(null);
            } else if (this.currentTerm) {
                const m = /[^\:]+\:\s*(.+)\s*$/.exec(input.value);
                if (m) {
                    this.addNewTerm({ name: this.currentTerm.name, label: this.currentTerm.label, value: m[1] });
                }
            }
        } else {
            if (this.props.onInputChanged) {
                this.props.onInputChanged(input.value);
            }
        }
    }

    public handleDateSelection(selected: Date[]) {
        this.selectedDates = selected;
    }

    public handleCloseDialog() {
        const inputValue = this.textInput.value;

        if (this.currentTerm && this.currentTerm.type === "date") {
            let dateRange = toDateString(this.selectedDates[0]) + ".." + toDateString(this.selectedDates[0]);

            if (/\:on\.\.\./.test(inputValue)) {
                dateRange = toDateString(this.selectedDates[0]) + ".." + toDateString(this.selectedDates[0]);
            }
            if (/\:after\.\.\./.test(inputValue)) {
                dateRange = toDateString(MIN_DATE) + ".." + toDateString(this.selectedDates[0]);
            }
            if (/\:before\.\.\./.test(inputValue)) {
                dateRange = toDateString(this.selectedDates[0]) + ".." + toDateString(MAX_DATE);
            }
            if (/\:between\.\.\./.test(inputValue) && this.selectedDates.length > 1) {
                dateRange = toDateString(this.selectedDates[0]) + ".." + toDateString(this.selectedDates[1]);
            }
            this.addNewTerm({ name: this.currentTerm.name, label: this.currentTerm.label, value: dateRange });
        }
        this.setState({ calendarOpen: false });
    }

    public render() {

        const dialogButtons = [
            __(FlatButton, {
                label: "Done",
                primary: true,
                keyboardFocused: false,
                onTouchTap: this.handleCloseDialog.bind(this),
                onClick: this.handleCloseDialog.bind(this),
            }),
        ];

        return _.div({ className: "search-box" }, [
            ...this.props.terms.map((t, i) => __(Chip, { key: i, onRequestDelete: () => this.props.onRemove(i) }, t.label + ":" + t.value)),
            _.input({ key: "input", list: "dropdown-list",
                      placeholder: "Type search term or 'Enter' to start searching...",
                      onChange: this.handleInputChange.bind(this),
                      onKeyUp: (evt) => this.handleInputKey.bind(this)(evt),
                      ref: (input) => { this.textInput = input; },
                    }),
            _.datalist({ key: "datalist", id: "dropdown-list" }, this.state.suggestionList ? this.state.suggestionList.map(n => _.option({ key: n }, n)) : []),
            _.div({ key: "div", className: "search-icon" },
                this.props.searching
                    ? __(CircularProgress, { size: 24 })
                    : __(SearchIcon, { color: iconColor, onClick: () => this.props.onEnter(null) }),
            ),
            __(Dialog, { // Dialog to display the date (range) selector.
                actions: dialogButtons,
                open: this.state.calendarOpen || false,
                onRequestClose: this.handleCloseDialog.bind(this),
                contentStyle: { width: "365px" },
            },
                __(Flatpickr.default, { options: { inline: true, mode: this.state.calendarMode }, onChange: this.handleDateSelection.bind(this) }),
            ),
        ]);

    }

}
