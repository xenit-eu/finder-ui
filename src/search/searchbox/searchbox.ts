import * as debug from "debug";
import Chip from "material-ui/Chip";
import CircularProgress from "material-ui/CircularProgress";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import SearchIcon from "material-ui/svg-icons/action/search";
import StarIcon from "material-ui/svg-icons/toggle/star-border";
import { cloneElement, Component, createElement as __, KeyboardEvent } from "react";
import * as _ from "react-dom-factories";
import "react-flatpickr/node_modules/flatpickr/dist/themes/material_blue.css";
import { SimpleDateRange } from "../DateRange";
import { DateFillinValueMatch, DateRangeFillinValueMatch, HierarchicQueryValueMatch, IAutocompleteSuggestion, InputHandleRequired, SimpleSearchQueryElementValueMatch } from "../searchables";
import { ISearchQueryElement, ISimpleSearchQueryElement } from "../searchquery";
import { ChipVMToChip, ChipVM_t, getKeyValue, SearchBox_t, SearchQueryElementToChipVM } from "./common";
import "./searchbox.less";
import { SearchboxAutocomplete } from "./SearchboxAutocomplete";
import { SearchboxHierarchyPicker } from "./searchboxHierarchyPicker";

declare var require: any;
// tslint:disable-next-line:no-var-requires
const Flatpickr = require("react-flatpickr");

export const iconColor = "#512e5f";

export const ValueNoKeyTerm = "ValueNoKeyTerm";
export const DATEPICKERLOCALE = "DATEPICKERLOCALE";
export const DATEPICKERDEFAULT = {};

type State_t = {
    textValue: string,
    suggestionsOpened: boolean,
    focusSuggestions: boolean,
    currentValueMatchWaitingForInput: DateFillinValueMatch | DateRangeFillinValueMatch | HierarchicQueryValueMatch | undefined,
    currentChipVMs: ChipVM_t[],
};

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
    private selectedHierarchy: number[];
    constructor(props: SearchBox_t) {
        super(props);
        this.state = {
            textValue: "",
            currentValueMatchWaitingForInput: undefined,
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
        return this.state.currentValueMatchWaitingForInput instanceof DateFillinValueMatch || this.state.currentValueMatchWaitingForInput instanceof DateRangeFillinValueMatch;
    }
    private isHierarchyPickerOpen() {
        return this.state.currentValueMatchWaitingForInput && this.state.currentValueMatchWaitingForInput.isHierarchic();
    }
    private getHierarchicQueryValueMatch() {
        if (!this.state.currentValueMatchWaitingForInput || !this.isHierarchyPickerOpen()) {
            throw new Error("No open");
        }
        return this.state.currentValueMatchWaitingForInput as HierarchicQueryValueMatch;
    }

    private getCalendarMode(): InputHandleRequired {
        const currentVMWFC = this.state.currentValueMatchWaitingForInput;
        return currentVMWFC ? currentVMWFC.requiredDateHandle() : InputHandleRequired.none;
    }

    public handleCloseDialog() {
        const valueMatchWaiting = this.state.currentValueMatchWaitingForInput;
        if (!valueMatchWaiting) {
            return;
        }
        if (valueMatchWaiting instanceof DateRangeFillinValueMatch) {
            this.setState({ currentValueMatchWaitingForInput: undefined });
            this.addNewQueryElement(valueMatchWaiting.onFillIn(new SimpleDateRange(this.selectedDates[0], this.selectedDates[1])));
            return;
        }
        if (valueMatchWaiting instanceof DateFillinValueMatch) {
            this.setState({ currentValueMatchWaitingForInput: undefined });
            this.addNewQueryElement(valueMatchWaiting.onFillIn(this.selectedDates[0]));
            return;
        }
        if (valueMatchWaiting.isHierarchic()) {
            const hierarchic = valueMatchWaiting as HierarchicQueryValueMatch;
            this.setState({ currentValueMatchWaitingForInput: undefined });
            this.addHierarchyElement(this.selectedHierarchy, hierarchic.type);
            return;
        }
    }

    public addNewQueryElement(queryElement: ISimpleSearchQueryElement) {
        this.props.onAddQueryElement(queryElement);
        this.setState({ textValue: "" });
        this.hideSuggestions();
    }
    public addHierarchyElement(index: number[], type: "and" | "or") {
        this.setState({ textValue: "" });
        this.hideSuggestions();
        const safeIndex = index ? index : [];
        this.props.onAddHierarchyElement(safeIndex, type);
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
                const result = matches.filter(p => p.hasResult())[0];
                return result;
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
                    this.setState({ currentValueMatchWaitingForInput: match });
                    return;
                }
                if (match.isHierarchic()) {
                    const hierarchicMatch = <HierarchicQueryValueMatch>match;
                    if (hierarchicMatch.hierarchyInfo.requiresUserChoice) {
                        this.setState({ currentValueMatchWaitingForInput: hierarchicMatch });
                        return;
                    }
                    this.addHierarchyElement(hierarchicMatch.hierarchyInfo.possibilities[0].index, hierarchicMatch.type);
                    return;
                }
                throw new Error("Unhandled type, should be one of the four existing types");
            });
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
    public handleHierarchySelection(selected: number[]) {
        this.selectedHierarchy = selected;
    }

    private updateChips(queryElements: ISearchQueryElement[]) {
        return Promise.all(queryElements.map((sQE, i) => SearchQueryElementToChipVM(sQE, [i], (n) => this.props.onRemoveQueryElement(n))))
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
        const doneButton = [
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
        const currentChips = this.state.currentChipVMs.map((c) => ChipVMToChip(c));
        const me = this;
        return _.div({ key: "search-box", className: "search-box" }, [
            defaultChip,
            ...currentChips,
            _.div({ className: "searchbox-input-area", key: "--searchbox-input" }, [
                __(SearchboxAutocomplete, {
                    key: "autocomplete",
                    value: this.state.textValue as string,
                    onChange: this.handleInputChange.bind(this),
                    onKeyUp: this.handleInputKey.bind(this),
                    onFocus: () => this.setState({ focusSuggestions: false }),
                    open: this.state.suggestionsOpened,
                    focusAutocomplete: this.state.focusSuggestions,
                    suggestions: filteredSuggestionsList,
                    onSuggestionClick: (suggestion: IAutocompleteSuggestion) => this.onApplyAutocompleteSuggestion(suggestion),
                    onDismiss: () => this.hideSuggestions(),
                    onBackspace: () => this.props.onRemoveLastQueryElement(),
                    onRequestAutocomplete: () => this.setState({ suggestionsOpened: true, focusSuggestions: true }),
                    translations: this.props.translations,
                }),
                _.div({ className: "searchbox-icon-wrapper", key: "icons" }, [

                    ...(this.props.customButtons || []).map((item, i) => cloneElement(item, { key: i })),

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
                actions: doneButton,
                open: this.isCalendarOpen() || false,
                onRequestClose: this.handleCloseDialog.bind(this),
                contentStyle: { width: "365px" },
                contentClassName: "searchbox-datepicker-dialog",
            },
                __(Flatpickr.default, {
                    key: "flatpikr",
                    options: {
                        inline: true,
                        mode: this.getCalendarMode() === InputHandleRequired.dateRange ? "range" : "single",
                        locale: this.props.translations && this.props.translations[DATEPICKERLOCALE] || DATEPICKERDEFAULT,
                    },
                    onChange: this.handleDateSelection.bind(this),
                }),
            ),
            this.isHierarchyPickerOpen() && __(SearchboxHierarchyPicker, {
                open: this.isHierarchyPickerOpen() || false,
                handleClose: () => me.handleCloseDialog.bind(this),
                getHierarchicQueryValueMatch: () => this.getHierarchicQueryValueMatch(),
                pickedChip: (id: number[]) => {
                    this.selectedHierarchy = id;
                    me.handleCloseDialog();
                },
            }),
        ]);
    }
}
