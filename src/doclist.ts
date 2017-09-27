import Checkbox from "material-ui/Checkbox";
import FlatButton from "material-ui/FlatButton";
import FontIcon from "material-ui/FontIcon";
import IconButton from "material-ui/IconButton";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import FileDownload from "material-ui/svg-icons/file/file-download";
import MoreHorizIcon from "material-ui/svg-icons/navigation/more-horiz";
import ToggleIndeterminateCheckBox from "material-ui/svg-icons/toggle/indeterminate-check-box";
import { createElement as __, DOM as _, ReactElement, ReactNode } from "react";
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

export type Doclist_Column_t = {
    name: string,
    label: string,
    alignRight?: boolean,
    sortable?: boolean,
    sortDirection?: SortDirection_t,
    format?: (a: any, props: Row_t, index: number) => string | ReactElement<any>,
};

export type OnSortColumnSelected_t = (columnIndex: number, columnName: string, direction: SortDirection_t) => void;

export type DocList_t_Data = {
    columns: Doclist_Column_t[],
    columnsPicker?: ReactElement<any>,
    data: Row_t[],
    pager: Pager_t,
    rowMenu: (rowIndex: number) => MenuItem_t[],
    rowToggled: (rowIndex: number) => boolean,
    togglable: boolean,
    toggledRows: number,
    className: string,
    rowStyle: (i: number) => any,
    documentNotFoundText?: string,
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


function SortableTh(c: Doclist_Column_t, onSortColumnSelected: OnSortColumnSelected_t): ReactElement<any> {
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
    return _.th({
        key: c.name + c.label,
        onClick: c.sortable ? () => { onSortColumnSelected(0, c.name, nextSort); } : () => { },
    }, [
            c.sortable ? __(FontIcon, {
                className: `header-icon fa fa-${iconName}`,
            }) : null,
            c.label,
        ]);
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

export function DocList({  className, columns, data, onDownloadButtonClick, onMenuSelected, onPageSelected, onRowSelected, onRowToggled,
    onSortColumnSelected, pager, rowMenu, rowStyle, rowToggled, togglable, columnsPicker, documentNotFoundText, toggledRows}: DocList_t): ReactElement<any> {
    let downloadComponents:ReactNode|false = false;
    if (togglable) {
        const allRows = data.map((_: any, key: number) => key);
        const rowToggleState: boolean[] = data.map((_: any, key: number) => rowToggled(key));
        const allRowsToggled = rowToggleState.every(toggled => toggled);
        const noRowsToggled = rowToggleState.every(toggled => !toggled);
        const style = {
            width: "initial",
        };
        downloadComponents = _.div({ style: { display: "flex", flexDirection: "row", alignItems: "center" } }, [
            !allRowsToggled && !noRowsToggled ?
                __(Checkbox, {
                    style: style,
                    checked: true,
                    checkedIcon: __(ToggleIndeterminateCheckBox),
                    onCheck: () => data.forEach((row, i) => onRowToggled(true, i, row)),
                }) :
                __(Checkbox, {
                    style: style,
                    checked: allRowsToggled && !noRowsToggled,
                    onCheck: (ev: any, checked: boolean) => data.forEach((row, i) => onRowToggled(checked, i, row)),
                }),
            __(IconButton, { disabled: toggledRows == 0, tooltip: toggledRows + " selected", onClick: onDownloadButtonClick }, [__(FileDownload)]),
        ]);
    }
    const headerelements = (<ReactElement<any>[]>[_.th({ key: "Menu" }, "")])
        .concat(togglable ? [_.th({ key: "toggle", align: "center", width: "1px"}, downloadComponents)] : [])
        .concat(columns.map(c => SortableTh(c, onSortColumnSelected)));

    const header = _.thead({ key: "header" }, [_.tr({ key: "head" }, headerelements)]);
    const style = rowStyle ? rowStyle : (i: number) => ({});
    const singleRowElements = (row: Row_t, i: number) =>
        [_.td({ key: "_menu" }, __(RowMenu, { rowIndex: i, menuItems: rowMenu(i), onMenuSelected }))]
            .concat((togglable ? [_.td({ key: "toggle", align: "center" }, __(Checkbox, { checked: rowToggled(i), onCheck: (ev: any, checked: boolean) => onRowToggled(checked, i, row) }))] : []))
            .concat(columns.map(col => _.td({ key: col.name + col.label, className: "doclist-col-"+col.name, onClick: () => onRowSelected(i) }, col.format ? col.format(row[col.name], row, i) : row[col.name])));

    const bodycontent = data.map((row, i) => _.tr({ style: style(i), key: i }, singleRowElements(row, i)));
    const body = _.tbody({ key: "body" }, bodycontent);
    const tableProps = { key: "table", className: className || "table table-hover table-striped table-mc-purple table-condensed", id: "doclist-table" };
    const table = _.div({ className: "table-scroll-wrapper"}, _.table(tableProps, [header, body])); // table
    const pagerComponent = __(Pager, { totalItems: pager.totalItems, pageSize: pager.pageSize, selected: pager.selected, pageSelected: onPageSelected });
    const emptyDocList = _.div({ className: "doclist-message"}, [documentNotFoundText]);
    return _.div({ className: "doclist" }, pager.totalItems > 0 ? [_.div({}, [columnsPicker, pagerComponent]), table] : [emptyDocList]);
}
