import CircularProgress from "material-ui/CircularProgress";
import DatePicker from "material-ui/DatePicker";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import SearchIcon from "material-ui/svg-icons/action/search";
import ErrorIcon from "material-ui/svg-icons/alert/error";
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
import { defineMode, Editor } from "codemirror";
const CodeMirror = require("react-codemirror");
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/lib/codemirror.css";

import { createHinter, createMode } from "./codemirror";
import { DatepickerAutocomplete } from "./datepickerautocomplete";
import lex, { Token, TokenType } from "./lexer";
import parse, { IASTNode, validateStream } from "./parser";
import { AutocompleteValue_t, IAutocompleteProvider } from "./typeahead";

import "./index.less"; // to be imported after other css, to fix layout problems.

defineMode("finder-query", createMode());

function toDateString(d: Date): string {
    return new Date(d.getTime() + (5 * 3600 * 1000)).toISOString().substring(0, 10);
};

class CustomAutoComplete implements IAutocompleteProvider {

    public constructor(private searchableTerms: SearchableTerm_t[], private datepicker: DatepickerAutocomplete) {
    }

    public needFields(): Promise<AutocompleteValue_t[]> {
        return Promise.resolve(this.searchableTerms.map((t: SearchableTerm_t) => t.label));
    }

    public needOperators(parsedCategory: string): Promise<AutocompleteValue_t[]> {
        const term = this.searchableTerms.filter((t: SearchableTerm_t) => t.label === parsedCategory)[0];
        const type = term ? term.type : "text";
        return Promise.resolve(type === "date" ? ["on", "from", "till"] : ["=", "contains"]);
    }

    public needValues(parsedCategory: string, parsedOperator: string, value: string): Promise<AutocompleteValue_t[]> {
        const term = this.searchableTerms.filter((t: SearchableTerm_t) => t.label === parsedCategory)[0];
        const type = term ? term.type : "text";
        if (type === "date") {
            return Promise.resolve([{
                text: "",
                render: (element: HTMLElement, self: any) => this.datepicker.render(element, self, isNaN(Date.parse(value)) ? new Date() : new Date(value)),
            }]);
        }

        return Promise.resolve(term && term.values.map(v => typeof v === "string" ? v : v.label ) || []);
    }
}

export type AdvancedSearchBox_t = {
    searching: boolean,                     // flag indicating that search process is busy => activate spinner !
    searchableTerms: SearchableTerm_t[],    // suggestions to be proposed on the drop-down list.
    onSearch: (apixQuery: any) => void,     // to initiate the search based on the last query.
    onSaveAsQuery: (name: string, query: FinderQuery) => void,
};

type AdvancedSearchBox_State_t = {
    queryError?: Error,
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
    private codemirror: Editor|null;
    private query: IASTNode|null = null;

    constructor(props: AdvancedSearchBox_t) {
        super(props);
        this.state = {
            queryError: null,
        };
        this.datepicker = new DatepickerAutocomplete(() => <Editor>this.codemirror, toDateString);
        this.customAutoComplete = new CustomAutoComplete(props.searchableTerms, this.datepicker);
    }

    public onChange(query: string) {

        const replaceFieldWithSearchTerm = (token: Token) => {
            if(token.type !== TokenType.FIELD) {
                return token;
            }
            let matchedTerm = this.props.searchableTerms.find(term => term.label === token.value);
            if(!matchedTerm) {
                return token;
            }
            return new Token(token.type, matchedTerm.name);
        };

        try {
            let tokens = lex(query);
            validateStream(tokens);
            this.query = parse(tokens.map(replaceFieldWithSearchTerm));
            this.setState({
                queryError: null,
            });
        } catch(e) {
            this.setState({
                queryError: e,
            });
        }
    }

    public render() {
        return _.div({ className: "search-box" }, [
            __(CodeMirror, {
                ref: (elem: any) => { this.codemirror = elem ? elem.getCodeMirror() : null; },
                options: {
                    hintOptions: {
                        hint: createHinter(this.customAutoComplete),
                        completeSingle: false,
                    },
                    mode: "finder-query",
                },
                onChange: this.onChange.bind(this),
                onCursorActivity: (cm: Editor) => (<any>cm).showHint(),
            }),
            _.div({ key: "save-icon", className: "save-icon icon" },
                __(StarIcon, { color: iconColor, onClick: () => this.props.onSaveAsQuery(prompt("Save query as") || "query", FinderQuery.fromAST(this.query)) }),
            ),
            _.div({ key: "div", className: "search-icon icon", title: this.state.queryError?this.state.queryError.toString():undefined },
                this.props.searching
                    ? __(CircularProgress, { size: 24 }) : (
                        this.state.queryError ? __(ErrorIcon, { color: iconColor })
                            : __(SearchIcon, { color: iconColor, onClick: () => this.props.onSearch(FinderQuery.fromAST(this.query)) })
                    ),
            ),
        ]);
    }

}
