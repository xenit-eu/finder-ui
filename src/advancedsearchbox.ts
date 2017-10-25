/**
 *  This component is based on react-filter-box component (https://www.npmjs.com/package/react-filter-box)
 *      example: https://github.com/nhabuiduc/react-filter-box/blob/master/js-example/src/demo3.js
 *
 */

import CircularProgress from "material-ui/CircularProgress";
import DatePicker from "material-ui/DatePicker";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import SearchIcon from "material-ui/svg-icons/action/search";
import StarIcon from "material-ui/svg-icons/toggle/star-border";
import { Component, createElement as __ } from "react";
import { SearchableTerm_t } from "./searchbox";
import { traverseAndReplace } from "./utils";
// tslint:disable-next-line:no-var-requires
const DatePickerDialog = require("material-ui/DatePicker/DatePickerDialog"); // no type description available for this one !
// tslint:disable-next-line:no-var-requires
const Calendar = require("material-ui/DatePicker/Calendar"); // no type description available for this one !

//import ReactFilterBox, { SimpleResultProcessing, Expression, GridDataAutoCompleteHandler } from "react-filter-box";
declare var require: any;
// tslint:disable-next-line:no-var-requires
const ReactFilterBox = <any> require("react-filter-box");

//import 'flatpickr/dist/themes/material_blue.css'
//import Flatpickr from 'react-flatpickr'

import * as Colors from "material-ui/styles/colors";
import getMuiTheme from "material-ui/styles/getMuiTheme";

import { FinderQuery } from "./finderquery";

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
import "react-filter-box/lib/react-filter-box.css";
import "./advancedsearchbox.less"; // to be imported after other css, to fix layout problems.

function toDateString(d: Date): string {
    return new Date(d.getTime() + (5 * 3600 * 1000)).toISOString().substring(0, 10);
};

// workaround for error: "TS2507: Type 'any' is not a constructor function type." (cfr https://github.com/Microsoft/TypeScript/issues/12971)
declare class GridDataAutoCompleteHandlerClass {
    constructor(data: any, options: any);
    public needOperators (parsedCategory: string): any;
    public needValues (parsedCategory: string, parsedOperator: string): any;
}
const GridDataAutoCompleteHandler = ReactFilterBox.GridDataAutoCompleteHandler as typeof GridDataAutoCompleteHandlerClass;

class CustomAutoComplete extends GridDataAutoCompleteHandler {

    private searchableTerms: SearchableTerm_t[];

    public constructor (data: any, options: any, searchableTerms: SearchableTerm_t[]) {
        super(data, options);
        this.searchableTerms = searchableTerms;
    }

    public needOperators (parsedCategory: string) {
        const term = this.searchableTerms.filter((t: SearchableTerm_t) => t.label === parsedCategory)[0];
        const type = term ? term.type : "text";
        return type === "date" ? ["on", "from", "till"] : ["=", "contains"];
    }

    public needValues (parsedCategory: string, parsedOperator: string) {
        const term = this.searchableTerms.filter((t: SearchableTerm_t) => t.label === parsedCategory)[0];
        const type = term ? term.type : "text";
        if (type === "date") {
            return [{ customType: "date" }];
        }
        return super.needValues(parsedCategory, parsedOperator);
    }
}

export type AdvancedSearchBox_t = {
    searching: boolean,                     // flag indicating that search process is busy => activate spinner !
    searchableTerms: SearchableTerm_t[],    // suggestions to be proposed on the drop-down list.
    onSearch: (apixQuery: any) => void,     // to initiate the search based on the last query.
    onSaveAsQuery: (name: string) => void,
};

// tslint:disable-next-line:type-name
type pick_t = (x: string) => void;

//@Component AdvancedSearchBox
//@ComponentDescription "Allows to type advanced queries using combination of OR and AND combined with parantheses"
//@Method AdvancedSearchBox Returns ReactComponent
//@MethodDescription "AdvancedSearchBox({param1: value1, param2: value2, ...})"
//@Param searching boolean "flag indicating that search process is busy => used to activate spinner"
//@Param searchableTerms SearchableTerm_t[] "suggestions to be proposed on the drop-down list."
//@Param onSearch (apixQuery: any) => void "callback called to start the search based on the current query passed as parameter."
//@Param onSaveAsQuery (name: string) => void "callback called to save the current query"

export class AdvancedSearchBox extends Component<AdvancedSearchBox_t, any> {

    private customAutoComplete: any;
    private query: string;
    private options: Array<{}>;
    private data: Array<{ [k: string]: string }>;

    private searcheableTermsByLabel: {[label: string]: SearchableTerm_t};

    constructor(props: AdvancedSearchBox_t) {
        super(props);
        // Extract from searchableTerms lists of values that should appear in the suggestion list.
        this.data = props.searchableTerms
            .filter((d: SearchableTerm_t) => d.type === "enum")
            .map((d: SearchableTerm_t) => d.values.map(v => { let x = {}; x[d.label] = v; return x; }))
            .reduce((result, item) => result.concat(item), []);
        this.options = props.searchableTerms.map(d => ({ columnField: d.name, columnText: d.label, type: d.values && d.values.length > 0 ? "selection" : "text" }));
        this.customAutoComplete = new CustomAutoComplete(this.data, this.options, props.searchableTerms);

        this.searcheableTermsByLabel = props.searchableTerms.reduce((obj, item) => { obj[item.label] = item; return obj; }, {});
    }

    public onDateSelected(selection: Date, pick: pick_t) {
        pick(toDateString(selection));
        //pick(selection.toString());
    }

    public customRenderCompletionItem(self: any, data: any, registerAndGetPickFunc: () => pick_t) {
        if (data.value && data.value.customType && data.value.customType === "date") {
            const pick: pick_t = registerAndGetPickFunc();
            return __("div", { className: "day-picker-selection" },
                __(MuiThemeProvider, { muiTheme },
                    //__(DatePicker, {container: "inline", onChange: (dummy: any, date: Date) => this.onDateSelected(date, pick), defaultDate: new Date()})
                    __(Calendar.default, {
                        container: "inline",
                        autoOk: true,
                        onTouchTapDay: (dummy: any, date: Date) => this.onDateSelected(date, pick),
                        firstDayOfWeek: 1,
                        initialDate: new Date(),
                    }),
                ),
            );
        }

        const className = ` hint-value cm-${data.type}`;
        return __("div", { className }, __("span", { style: { fontWeight: "bold" } }, data.value));
        //           <span style={{color:"gray", fontSize:10}}> [{data.type}] </span>
    }

    public onChange(query: any) {

    }

    public onParseOk(expressions: any) {
        this.query = expressions;
        // traverse the query to replace the labels to names necessary for the query.
        traverseAndReplace(this.query, (prop: string, val: any) => {
            if (prop === "category" && this.searcheableTermsByLabel[val]) {
                return this.searcheableTermsByLabel[val].name;
            }
        });
    }

    public render() {
        return __("div", { className: "search-box" }, [__(ReactFilterBox.default, {
            options: this.options,
            data: this.data,
            autoCompleteHandler: this.customAutoComplete,
            customRenderCompletionItem: this.customRenderCompletionItem.bind(this),
            onParseOk: this.onParseOk.bind(this),
            onChange: this.onChange.bind(this),
        }),
        __("div", { key: "save-icon", className: "save-icon" }, __(StarIcon, { color: iconColor, onClick: () => this.props.onSaveAsQuery(prompt("Save query as") || "query") })),
        __("div", { key: "div", className: "search-icon" },
            this.props.searching
                ? __(CircularProgress, { size: 24 })
                : __(SearchIcon, { color: iconColor, onClick: () => this.props.onSearch(FinderQuery.fromAdvancedQuery(this.query)) }),
        ),
        ]);
    }

}
