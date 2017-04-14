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

export type Row_t = { props: { [k: string]: string }, toggled?: boolean, noderef: string };

export enum SortDirection_t {
    NONE,
    ASC,
    DESC,
};

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
    rowMenu: MenuItem_t[],
    onPageSelected: (pageIndex: number) => void,
    onRowSelected: (rowIndex: number) => void,
    togglable: boolean,
    onRowToggled: (checked: boolean, i: number, row: Row_t) => void,
    onMenuSelected: OnMenuSelected_t,
    onSortColumnSelected: OnSortColumnSelected_t,
    className: string,
    onDownloadButtonClick: () => void,
    rowStyle: (i: number) => any,
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

export function DocList({columns, data, pager, onPageSelected, rowMenu, onRowSelected, onDownloadButtonClick
    , onMenuSelected, onSortColumnSelected, togglable, onRowToggled, className, rowStyle}: DocList_t): ReactElement<any> {
    const headerelements = [_.th({ key: "Menu" }, "")]
        .concat(togglable ? [_.th({ key: "toggle" }, __(FlatButton, { icon: __(FileDownload, { onClick: onDownloadButtonClick }) }))] : [])
        .concat(columns.map(c => _.th({ key: c.name + c.label }, [sortIcon(c, onSortColumnSelected), c.label])));

    const header = _.thead({ key: "header" }, [_.tr({ key: "head" }, headerelements)]);
    const style = rowStyle ? rowStyle : (i: number) => ({});
    const singleRowElements = (row: Row_t, i: number) =>
        [_.td({ key: "_menu" }, __(RowMenu, { rowIndex: i, menuItems: rowMenu, onMenuSelected }))]
            .concat((togglable ? [_.td({ key: "toggle", align: "center" }, __(Checkbox, { checked: row.toggled, onCheck: (ev: any, checked: boolean) => onRowToggled(checked, i, row) }))] : []))
            .concat(columns.map(col => _.td({ key: col.name + col.label, onClick: () => onRowSelected(i) }, col.format ? col.format(row.props[col.name], row) : row.props[col.name])));

    const bodycontent = data.map((row, i) => _.tr({ style: style(i), key: i }, singleRowElements(row, i)));
    const body = _.tbody({ key: "body" }, bodycontent);
    const tableProps = { key: "table", className: className || "table table-hover table-striped table-mc-purple table-condensed" };
    const table = _.table(tableProps, [header, body]); // table
    const pagerComponent = __(Pager, { totalItems: pager.totalItems, pageSize: pager.pageSize, selected: pager.selected, pageSelected: onPageSelected });
    return _.div({ className: "doclist" }, pager.totalItems > 0 ? [pagerComponent, table] : []);
}
