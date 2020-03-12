import { Menu, MenuItem, Paper } from "material-ui";
import { Component, createElement as __, KeyboardEvent, ReactElement } from "react";
import * as _ from "react-dom-factories";
import { IAutocompleteSuggestion } from "../searchables";
import { ISynchronousTranslationService } from "../searchquery";
type Autocomplete_t = {
    value: string,
    onChange: (ev: any) => void,
    onKeyUp: (ev: any) => void,
    onFocus: () => void,
    open: boolean,
    focusAutocomplete: boolean,
    suggestions: ReadonlyArray<IAutocompleteSuggestion>,
    onSuggestionClick: (suggestion: IAutocompleteSuggestion) => void,
    onDismiss: () => void,
    onBackspace: () => void,
    onRequestAutocomplete: () => void,
    translate: ISynchronousTranslationService,
};
export const PLACEHOLDERTRANSLATION = "PLACEHOLDERTRANSLATION";
export const PLACEHOLDERDEFAULT = "Type search term/query or 'Enter' to start searching...";

export class SearchboxAutocomplete extends Component<Autocomplete_t, {}> {
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

    private handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        e.stopPropagation();
        switch (e.keyCode) {
            case 9: //Tab
            case 40: // ARROWKEY_DOWN
                e.preventDefault();
                if (this.menu) {
                    this.props.onRequestAutocomplete();
                    (this.menu as any).setFocusIndex(e, 0, true);
                }
                break;
            case 27: //ESC
                this.handleDismiss();
                break;
            case 8: // Backspace
                if (e.currentTarget.selectionStart === e.currentTarget.selectionEnd && e.currentTarget.selectionStart === 0) {
                    this.handleBackspace();
                }
                break;
            default:
        }
    }

    private handleDismiss() {
        if (this.props.focusAutocomplete && this.inputElem) {
            this.inputElem.focus();
        }
        this.props.onDismiss();
    }

    private handleBackspace() {
        this.props.onBackspace();
    }

    private getPlaceHolder() {
        const translated: string | undefined = this.props.translate(PLACEHOLDERTRANSLATION);
        return translated ? translated : PLACEHOLDERDEFAULT;
    }
    public render(): ReactElement {
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
                onKeyDown: this.handleKeyDown.bind(this),
                onKeyUp: this.props.onKeyUp,
                onFocus: this.props.onFocus,
                ref: (input) => { this.inputElem = input as HTMLInputElement; },
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
    suggestions: ReadonlyArray<IAutocompleteSuggestion>,
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
                minWidth: "500px",
            },
        },
            __(Menu, <any> {
                ref: this.props.menuRef,
                //Types of maxheight are correct, runtime checks are not. See in browser, this does work.
                maxHeight: "80vh",
                width: "100%",
                autoWidth: false,
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
                style: { overflow: "hidden", textOverflow: "ellipsis" },
                key: option.DisplayKey() + "-" + option.DisplayValue(),
                value: option,
                //primaryText: option.DisplayKey() + ":" + option.DisplayValue(),
                children: _.span({ title: option.DisplayKey() + ":" + option.DisplayValue() }, option.DisplayKey() + ":" + option.DisplayValue()),
            })),
            ),
        );
    }
}

function uniqueSuggestionsFilter(suggestion: IAutocompleteSuggestion, i: number, suggestions: IAutocompleteSuggestion[]): boolean {
    const firstIndex = suggestions.findIndex((sug) => sug.DisplayKey() === suggestion.DisplayKey() && sug.DisplayValue() === suggestion.DisplayValue());
    return i === firstIndex;
}
