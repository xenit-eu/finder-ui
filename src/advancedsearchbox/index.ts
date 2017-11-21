import CircularProgress from "material-ui/CircularProgress";
import DatePicker from "material-ui/DatePicker";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import SearchIcon from "material-ui/svg-icons/action/search";
import StarIcon from "material-ui/svg-icons/toggle/star-border";
import { cloneElement, Component, createElement as __, DOM as _ } from "react";
import { SearchableTerm_t } from "../searchbox";
import { traverseAndReplace } from "../utils";

import * as Colors from "material-ui/styles/colors";
import getMuiTheme from "material-ui/styles/getMuiTheme";

import { FinderQuery } from "../finderquery";

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: Colors.lightBlue700,
        primary2Color: Colors.lightBlue700,
        primary3Color: Colors.lightBlue700,
        accent1Color: Colors.deepOrange700,
        accent2Color: Colors.deepOrange700,
        accent3Color: Colors.deepOrange700,
    },
});

const iconColor = "#09A89E";

// Codemirror
import {defineMode, Editor} from "codemirror";
import CodeMirror from "react-codemirror";
import "codemirror/lib/codemirror.css";
import { DatepickerAutocomplete} from "./datepickerautocomplete";
import { AutocompleteValue_t, IAutocompleteProvider } from "./typeahead";
import { createHinter, createMode } from "./codemirror";
import "codemirror/addon/hint/show-hint";

import "./index.less"; // to be imported after other css, to fix layout problems.

defineMode("finder-query", createMode());

function toDateString(d: Date): string {
    return new Date(d.getTime() + (5 * 3600 * 1000)).toISOString().substring(0, 10);
};

class CustomAutoComplete implements IAutocompleteProvider {

    public constructor (private searchableTerms: SearchableTerm_t[], private datepicker: DatepickerAutocomplete) {
    }

    public needFields(): Promise<AutocompleteValue_t[]> {
        return Promise.resolve(this.searchableTerms.map((t: SearchableTerm_t) => t.label));
    }

    public needOperators (parsedCategory: string): Promise<AutocompleteValue_t[]> {
        const term = this.searchableTerms.filter((t: SearchableTerm_t) => t.label === parsedCategory)[0];
        const type = term ? term.type : "text";
        return Promise.resolve(type === "date" ? ["on", "from", "till"] : ["=", "contains"]);
    }

    public needValues (parsedCategory: string, parsedOperator: string, value: string): Promise<AutocompleteValue_t[]> {
        const term = this.searchableTerms.filter((t: SearchableTerm_t) => t.label === parsedCategory)[0];
        const type = term ? term.type : "text";
        if (type === "date") {
            return Promise.resolve([{
                render: (element, self) => this.datepicker.render(element, self, new Date(value)),
            }]);
        }
        return Promise.resolve([]);
    }
}

export type AdvancedSearchBox_t = {
    searching: boolean,                     // flag indicating that search process is busy => activate spinner !
    searchableTerms: SearchableTerm_t[],    // suggestions to be proposed on the drop-down list.
    onSearch: (apixQuery: any) => void,     // to initiate the search based on the last query.
    onSaveAsQuery: (name: string) => void,
};

//@Component AdvancedSearchBox
//@ComponentDescription "Allows to type advanced queries using combination of OR and AND combined with parantheses"
//@Method AdvancedSearchBox Returns ReactComponent
//@MethodDescription "AdvancedSearchBox({param1: value1, param2: value2, ...})"
//@Param searching boolean "flag indicating that search process is busy => used to activate spinner"
//@Param searchableTerms SearchableTerm_t[] "suggestions to be proposed on the drop-down list."
//@Param onSearch (apixQuery: any) => void "callback called to start the search based on the current query passed as parameter."
//@Param onSaveAsQuery (name: string) => void "callback called to save the current query"

export class AdvancedSearchBox extends Component<AdvancedSearchBox_t, any> {

    private customAutoComplete: CustomAutoComplete;
    private datepicker: DatepickerAutocomplete;
    private codemirror: Editor;
    private query: string;

    constructor(props: AdvancedSearchBox_t) {
        super(props);
        this.datepicker = new DatepickerAutocomplete(() => this.codemirror, toDateString);
        this.customAutoComplete = new CustomAutoComplete(props.searchableTerms, this.datepicker);
    }

    public onChange(query: any) {
        this.query = query;
        // traverse the query to replace the labels to names necessary for the query.
        traverseAndReplace(this.query, (prop: string, val: any) => {
            if (prop === "category" && this.searcheableTermsByLabel[val]) {
                return this.searcheableTermsByLabel[val].name;
            }
        });
    }

    public render() {
        return _.div({ className: "search-box" }, [
            __(CodeMirror, {
                ref: (elem) => { this.codemirror = elem.getCodeMirror(); },
                options: {
                    hintOptions: {
                        hint: createHinter(this.customAutoComplete),
                        completeSingle: false,
                    },
                    mode: "finder-query",
                },
                onChange: this.onChange.bind(this),
                onCursorActivity: (cm: Editor) => cm.showHint(),

            }),
        _.div({ key: "save-icon", className: "save-icon icon" },__(StarIcon, { color: iconColor, onClick: () => this.props.onSaveAsQuery(prompt("Save query as") || "query") })),
        _.div({ key: "div", className: "search-icon icon" },
            this.props.searching
                ? __(CircularProgress, { size: 24 })
                : __(SearchIcon, { color: iconColor, onClick: () => this.props.onSearch(FinderQuery.fromAdvancedQuery(this.query)) }),
        ),
        ]);
    }

}
