import Checkbox from "material-ui/Checkbox";
import FlatButton from "material-ui/FlatButton";
import FontIcon from "material-ui/FontIcon";
import IconButton from "material-ui/IconButton";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import FileDownload from "material-ui/svg-icons/file/file-download";
import MoreHorizIcon from "material-ui/svg-icons/navigation/more-horiz";
import { createElement as __, DOM as _, ReactElement } from "react";
import "./doclist.less";
import { Pager, Pager_t } from "./pager";

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

function RowMenu({rowIndex, menuItems, onMenuSelected}: RowMenu_t): ReactElement<any> {
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
    NONE,
    ASC,
    DESC,
};

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

export type Column_t = {
    name: string,
    label: string,
    alignRight?: boolean,
    sortable?: boolean,
    sortDirection?: SortDirection_t,
    format?: (a: any, props: Row_t) => string,
};

export type OnSortColumnSelected_t = (columnIndex: number, columnName: string, direction: SortDirection_t) => void;

export type DocList_t = {
    columns: Column_t[],
    data: Row_t[],
    pager: Pager_t,
    rowMenu: (rowIndex: number) => MenuItem_t[],
    rowToggled: (rowIndex: number) => boolean,
    togglable: boolean,
    className: string,
    rowStyle: (i: number) => any,

    onPageSelected: (pageIndex: number) => void,
    onRowSelected: (rowIndex: number) => void,
    onRowToggled: (checked: boolean, i: number, row: Row_t) => void,
    onMenuSelected: OnMenuSelected_t,
    onSortColumnSelected: OnSortColumnSelected_t,
    onDownloadButtonClick: () => void,
};

function sortIcon(c: Column_t, onSortColumnSelected: OnSortColumnSelected_t): ReactElement<any> | undefined {
    let iconName: string = "sort";
    let nextSort: SortDirection_t = SortDirection_t.NONE;
    switch (c.sortDirection) {
        case SortDirection_t.ASC:
            iconName = "sort-asc";
            nextSort = SortDirection_t.DESC;
            break;
        case SortDirection_t.DESC:
            iconName = "sort-desc";
            nextSort = SortDirection_t.NONE;
            break;
        case SortDirection_t.NONE:
            iconName = "sort";
            nextSort = SortDirection_t.ASC;
            break;
        default:
            break;
    }
    return c.sortable
        ? __(FontIcon, {
            onClick: () => { onSortColumnSelected(0, c.name, nextSort); }, className: `header-icon fa fa-${iconName}`,
        })
        : undefined;
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

export function DocList({  className, columns, data, onDownloadButtonClick, onMenuSelected, onPageSelected, onRowSelected, onRowToggled,
    onSortColumnSelected, pager, rowMenu, rowStyle, rowToggled, togglable}: DocList_t): ReactElement<any> {
    const headerelements = [_.th({ key: "Menu" }, "")]
        .concat(togglable ? [_.th({ key: "toggle" }, __(FlatButton, { icon: __(FileDownload, { onClick: onDownloadButtonClick }) }))] : [])
        .concat(columns.map(c => _.th({ key: c.name + c.label }, [sortIcon(c, onSortColumnSelected), c.label])));

    const header = _.thead({ key: "header" }, [_.tr({ key: "head" }, headerelements)]);
    const style = rowStyle ? rowStyle : (i: number) => ({});
    const singleRowElements = (row: Row_t, i: number) =>
        [_.td({ key: "_menu" }, __(RowMenu, { rowIndex: i, menuItems: rowMenu(i), onMenuSelected }))]
            .concat((togglable ? [_.td({ key: "toggle", align: "center" }, __(Checkbox, { checked: rowToggled(i), onCheck: (ev: any, checked: boolean) => onRowToggled(checked, i, row) }))] : []))
            .concat(columns.map(col => _.td({ key: col.name + col.label, onClick: () => onRowSelected(i) }, col.format ? col.format(row[col.name], row) : row[col.name])));

    const bodycontent = data.map((row, i) => _.tr({ style: style(i), key: i }, singleRowElements(row, i)));
    const body = _.tbody({ key: "body" }, bodycontent);
    const tableProps = { key: "table", className: className || "table table-hover table-striped table-mc-purple table-condensed" };
    const table = _.table(tableProps, [header, body]); // table
    const pagerComponent = __(Pager, { totalItems: pager.totalItems, pageSize: pager.pageSize, selected: pager.selected, pageSelected: onPageSelected });
    return _.div({ className: "doclist" }, pager.totalItems > 0 ? [pagerComponent, table] : []);
}
