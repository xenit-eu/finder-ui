import Checkbox from "material-ui/Checkbox";
import FlatButton from "material-ui/FlatButton";
import FontIcon from "material-ui/FontIcon";
import IconButton from "material-ui/IconButton";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import FileDownload from "material-ui/svg-icons/file/file-download";
import MoreHorizIcon from "material-ui/svg-icons/navigation/more-horiz";
import ToggleIndeterminateCheckBox from "material-ui/svg-icons/toggle/indeterminate-check-box";
import { createElement as __, ReactElement, ReactNode } from "react";
import * as _ from "react-dom-factories";

import { Node_t } from "../metadata/fields";
import { Pager, Pager_t } from "../pager";
import "./doclist.less";
import { ColumnRenderer_Props_t, ColumnRenderer_t } from "./renderer/interface";

type OnMenuSelected_t = (rowIndex: number, menuIndex: number, key?: string) => void;

/*

#### menu item hash description

| Key    | Description                             |
|--------------|-----------                                |
| label | label to be displayed for the menu   |
| key | (optional) key of the menu that will be passed to the onMenuSelected callback described above |
 */

export type MenuItem_t = {
    key?: string,
    label: string,
    disabled: boolean,
};

type RowMenu_t = {
    rowIndex: number,
    menuItems: MenuItem_t[],
    onMenuSelected: OnMenuSelected_t,
};

function RowMenu({ rowIndex, menuItems, onMenuSelected }: RowMenu_t): ReactElement<any> {
    return __(IconMenu, {
        iconButtonElement: __(IconButton, { style: { height: "15px", padding: "0" } },
            __(MoreHorizIcon, { color: "grey" })),
        targetOrigin: { horizontal: "right", vertical: "top" },
        anchorOrigin: { horizontal: "right", vertical: "top" },
    },
        menuItems.map((mi, i) =>
            __(MenuItem, { key: i, primaryText: mi.label, disabled: mi.disabled, onClick: () => onMenuSelected(rowIndex, i, mi.key) })),
    );
}

export type Row_t = { [k: string]: string };

export enum SortDirection_t {
    NONE = "NONE",
    ASC = "ASC",
    DESC = "DESC",
};
export function SortDirectionFromString(s: string) {
    if (s === SortDirection_t.NONE) {
        return SortDirection_t.NONE;
    }
    if (s === SortDirection_t.ASC) {
        return SortDirection_t.ASC;
    }
    if (s === SortDirection_t.DESC) {
        return SortDirection_t.DESC;
    }
    throw new Error("Unknown sorting direction");
}
/*
#### columns hash description

| Key    | Description                             |
|--------------|-----------                                |
| name         | name identifying uniquely the column (the alfresco property name)   |
| label        | Label to put on top of the table   |
| alignRight   | (optional) Not used yet (default: false)   |
| sortable     | (optional) boolean indicating if column can be sorted by user (default: false)   |
| sortDirection| (optional) default sort direction : NONE(default), ASC, DESC   |
| format       | (optional) function to call to format the data to be displayed |
*/

export type Doclist_Column_t = {
    name: string,
    label: string,
    alignRight?: boolean,
    sortable?: boolean,
    fixed?: boolean,
    sortDirection?: SortDirection_t,
    format?: (a: any, props: Row_t, index: number) => string | ReactElement<any>,
    renderer?: ColumnRenderer_t,
};

export type OnSortColumnSelected_t = (columnIndex: number, columnName: string, direction: SortDirection_t) => void;

export const DOCLIST_TRANSLATIONS = {
    SORT_ASC: "finder-ui.doclist.TRANSLATION_SORT_ASC",
    SORT_DESC: "finder-ui.doclist.TRANSLATION_SORT_DESC",
    SORT: "finder-ui.doclist.TRANSLATION_SORT",
};

type Translations_t = {
    [k: string]: string,
} | undefined;

const defaultTranslations = {
    [DOCLIST_TRANSLATIONS.SORT_ASC]: "sorted in ascending order",
    [DOCLIST_TRANSLATIONS.SORT_DESC]: "sorted in descending order",
    [DOCLIST_TRANSLATIONS.SORT]: "not sorted",
};

function translate(translations: Translations_t, key: string) {
    return translations && translations[key] !== undefined ? translations[key] : defaultTranslations[key];
}

export type DocList_t_Data = {
    data?: Row_t[],
    nodes?: Node_t[],
    columns: Doclist_Column_t[],
    columnsPicker?: ReactElement<any>,
    pager: Pager_t,
    rowMenu: (rowIndex: number) => MenuItem_t[],
    rowToggled: (rowIndex: number) => boolean,
    togglable: boolean,
    toggledRows: number,
    className: string,
    rowStyle: (i: number) => any,
    documentNotFoundText?: string,
    translations?: Translations_t,
};

export type DocList_t_Actions = {
    onPageSelected: (pageIndex: number) => void,
    onRowSelected: (rowIndex: number) => void,
    onRowToggled: (checked: boolean, i: number, row: Row_t) => void,
    onMenuSelected: OnMenuSelected_t,
    onSortColumnSelected: OnSortColumnSelected_t,
    onDownloadButtonClick: () => void,
};
export type DocList_t = DocList_t_Data & DocList_t_Actions;

function SortableTh(c: Doclist_Column_t, onSortColumnSelected: OnSortColumnSelected_t, translations: Translations_t): ReactElement<any> {
    let iconName: string = "sort";
    let nextSort: SortDirection_t = SortDirection_t.NONE;
    let title = "";
    switch (c.sortDirection) {
        case SortDirection_t.ASC:
            iconName = "sort-asc";
            nextSort = SortDirection_t.DESC;
            title = translate(translations, DOCLIST_TRANSLATIONS.SORT_ASC);
            break;
        case SortDirection_t.DESC:
            iconName = "sort-desc";
            nextSort = SortDirection_t.NONE;
            title = translate(translations, DOCLIST_TRANSLATIONS.SORT_DESC);
            break;
        case SortDirection_t.NONE:
            iconName = "sort";
            nextSort = SortDirection_t.ASC;
            title = translate(translations, DOCLIST_TRANSLATIONS.SORT);
            break;
        default:
            break;
    }
    return _.th({
        key: c.name + c.label,
        onClick: c.sortable ? () => { onSortColumnSelected(0, c.name, nextSort); } : () => { },
    },
        c.sortable ? __(FontIcon, {
            className: `header-icon fa fa-${iconName}`,
            title,
        }) : null,
        _.div({ className: "doclist-column-title" }, c.label),
    );
}

//@Component DocList
//@ComponentDescription "Display a paged list of documents, columns can be sorted and each row can have a menu."
//@Method DocList Returns ReactComponent
//@MethodDescription "DocList({param1: value1, param2: value2, ...})"
//@Param className string "Name of the css class to give to the doclist"
//@Param columns Column_t[] "description of columns to be displayed (array of hash, see below for details)"
//@Param data Row_t[] "array of hash (name => value) to be displayed. The name here should match the name of the column to be displayed in columns "
//@Param onDownloadButtonClick ()=>void   "callback indicating the download button is clicked"
//@Param onMenuSelected  OnMenuSelected_t "callback indicating the menu called on a specific row "
//@Param onPageSelected (pageIndex:number)=>void  "callback function called when a page has been clicked (index of selected page is passed to the callback, starting at 1) |"
//@Param onRowSelected  (rowIndex:number)=>void "callback function called when a row has been clicked (index of selected row is passed to the callback) |"
//@Param onSortColumnSelected OnSortColumnSelected_t "callback called when a sort has been requested for a column"
//@Param pager Pager_t "paging instructions (see below for details)"
//@Param rowMenu  MenuItem_t[]     "Array of Menu Item (hash, see below for details) to be displayed on each row."
//@Param rowStyle  (i)=>any     "Function that provides the style of the ith row"
//@Param rowToggled (i)=>boolean "Function that says whether the row is toggled"
//@Param togglable boolean "Whether rows are togglable or not"
//@Param columnsPicker any "Column picker element"
//@Param toggledRows number "The number of rows that have been toggled in total"
/**
 * @deprecated use NodeTable instead
 */
export function DocList({ className, columns, data, nodes, onDownloadButtonClick, onMenuSelected, onPageSelected, onRowSelected,
    onRowToggled, onSortColumnSelected, pager, rowMenu, rowStyle, rowToggled, togglable, columnsPicker, documentNotFoundText,
    toggledRows, translations }: DocList_t): ReactElement<any> {

    // Convert data to node
    nodes = upgradeDataToNodes(data, nodes);
    columns = columns.map(upgradeColumnFormatToRender);

    let downloadComponents: ReactNode | false = false;
    if (togglable) {
        const allRows = nodes.map((_: any, key: number) => key);
        const rowToggleState: boolean[] = nodes.map((_: any, key: number) => rowToggled(key));
        const allRowsToggled = rowToggleState.every(toggled => toggled);
        const noRowsToggled = rowToggleState.every(toggled => !toggled);
        const style = {
            width: "initial",
        };

        downloadComponents = _.div({ key: "downloadComponents", style: { display: "flex", flexDirection: "row", alignItems: "center" } },
            !allRowsToggled && !noRowsToggled ?
                __(Checkbox, {
                    key: "allRowsToggled",
                    style,
                    checked: true,
                    checkedIcon: __(ToggleIndeterminateCheckBox),
                    onCheck: () => (<Node_t[]>nodes).forEach((node, i) => onRowToggled(true, i, nodeToRow(node))),
                }) :
                __(Checkbox, {
                    key: "notAllRowsToggled",
                    style,
                    checked: allRowsToggled && !noRowsToggled,
                    onCheck: (ev: any, checked: boolean) => (<Node_t[]>nodes).forEach((node, i) => onRowToggled(checked, i, nodeToRow(node))),
                }),
            __(IconButton, { key: "iconButton", disabled: toggledRows === 0, tooltip: toggledRows + " selected", onClick: onDownloadButtonClick }, [__(FileDownload, { key: "FileDownload" })]),
        );
    }
    const headerelements = (<ReactElement<any>[]>[_.th({ key: "Menu" }, "")])
        .concat(togglable ? [_.th({ key: "toggle", style: { textAlign: "center", width: "1px" } }, downloadComponents)] : [])
        .concat(columns.map(c => SortableTh(c, onSortColumnSelected, translations)));

    const header = _.thead({ key: "header" }, [_.tr({ key: "head" }, headerelements)]);
    const style = rowStyle ? rowStyle : (i: number) => ({});
    const singleRowElements = (node: Node_t, i: number) =>
        [_.td({ key: "_menu" }, __(RowMenu, { rowIndex: i, menuItems: rowMenu(i), onMenuSelected }))]
            .concat((togglable ? [
                _.td({ key: "toggle", style: { textAlign: "center" } }, __(Checkbox, { checked: rowToggled(i), onCheck: (ev: any, checked: boolean) => onRowToggled(checked, i, nodeToRow(node)) })),
            ] : []))
            .concat(columns.map(col => buildSingleTD(col, node, onRowSelected, i)));

    const bodycontent = nodes.map((node, i) => _.tr({ style: style(i), key: "tableRow" + i }, singleRowElements(node, i)));
    const body = _.tbody({ key: "body" }, bodycontent);
    const tableProps = { key: "table", className: className || "table table-hover table-striped table-mc-purple table-condensed", id: "doclist-table" };
    const table = _.div({ key: "table-scroll-wrapper", className: "table-scroll-wrapper" }, _.table(tableProps, header, body)); // table
    const pagerComponent = __(Pager, { totalItems: pager.totalItems, pageSize: pager.pageSize, selected: pager.selected, pageSelected: onPageSelected });
    const emptyDocList = _.div({ className: "doclist-message" }, documentNotFoundText);
    return _.div({ key: "doclist", className: "doclist" }, pager.totalItems > 0 ?
        [table, _.div({ key: "doclist-header", className: "doclist-header" }, pagerComponent, columnsPicker)] : emptyDocList);
}
function buildSingleTD(col: Doclist_Column_t, node: Node_t, onRowSelected: (i: number) => void, i: number) {
    return _.td(
        {
            key: col.name + col.label, className: "doclist-col-" + col.name,
            onClick: () => onRowSelected(i),
        }, __(col.renderer || "span", {
            node,
            row: i,
            highlights:[],
        }));
}

function upgradeDataToNodes(data?: Row_t[], nodes?: Node_t[]): Node_t[] {
    if (nodes) {
        return nodes;
    }

    if (data) {
        return data.map((row: Row_t) => {
            let node = {
                type: "",
                aspects: <any[]>[],
                properties: {},
            };

            Object.keys(row).forEach((key: string) => {
                node.properties[key] = [row[key]];
            });
            return node;
        });

    }
    throw new Error("Either data or nodes must be passed.");
}

function nodeToRow(node: Node_t): Row_t {
    let row = {};
    Object.keys(node.properties).forEach(key => row[key] = node.properties[key][0]);
    return row;
}

function upgradeColumnFormatToRender(col: Doclist_Column_t): Doclist_Column_t {
    return {
        // tslint:disable-next-line:only-arrow-functions
        renderer: function UpgradedFormatRenderer(props: ColumnRenderer_Props_t): ReactElement<any> {
            let value = col.format ? col.format(props.node.properties[col.name][0], nodeToRow(props.node), props.row) : props.node.properties[col.name][0];
            return typeof value === "string" ? _.span({}, value) : value;
        },
        ...col,
    };
}
