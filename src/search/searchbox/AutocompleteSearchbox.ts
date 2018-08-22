import { flatten } from "finder-utils";
import { Component, createElement as __ } from "react";
import { IAutocompleteSuggestion } from "../searchables";
import { getKeyValue, SearchBox_t } from "./common";
import { SearchBox } from "./searchbox";
type AutocompleteSearchBox_State_t = {
    autocompleteText?: string,
    currentSuggestions?: ReadonlyArray<IAutocompleteSuggestion>,
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
    protected getAutocompleteList(text: string) {
        const currentKeyValue = getKeyValue(text);
        const autocompletionsP = Promise.all(this.props.searchableQueryElements.map(p => p.getPartiallyMatchingAutocompleteListElements(currentKeyValue.key, currentKeyValue.value)));
        return autocompletionsP.then(autocompletions => flatten<IAutocompleteSuggestion>(autocompletions));
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