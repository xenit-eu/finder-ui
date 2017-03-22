import { DOM as _, createElement as __, ReactElement } from 'react';
import { Pager, Pager_t } from './pager'

import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreHorizIcon from 'material-ui/svg-icons/navigation/more-horiz';

import "./doclist.less";

type OnMenuSelected = (rowIndex: number, menuIndex: number, key?: string) => void;

export type MenuItem_t = {
    key?: string,
    label: string
};

type RowMenu_t = {
    rowIndex: number,
    menuItems: MenuItem_t[],
    onMenuSelected: OnMenuSelected
};

function RowMenu({rowIndex, menuItems, onMenuSelected}: RowMenu_t): ReactElement<any> {
    return __(IconMenu, {
        iconButtonElement: __(IconButton, { style: { height: '15px', padding: '0' } }, __(MoreHorizIcon, { color: 'grey' })),
        targetOrigin: { horizontal: 'right', vertical: 'top' },
        anchorOrigin: { horizontal: 'right', vertical: 'top' }
    },
        menuItems.map((mi, i) => __(MenuItem, { key: i, primaryText: mi.label, onClick: () => onMenuSelected(rowIndex, i, mi.key) }))
    );
}

export type Row_t = { [k: string]: string };

export enum SortDirection_t {
    NONE,
    ASC,
    DESC
};

export type Column_t = {
    name: string,
    label: string,
    alignRight?: boolean,
    sortable?: boolean,
    sortDirection?: SortDirection_t,
    format?: (a: any, props: Row_t) => string
};

export type OnSortColumnSelected_t = (columnIndex: number, columnName: string, direction: SortDirection_t) => void;

export type DocList_t = {
    columns: Column_t[],
    data: Row_t[],
    pager: Pager_t,
    rowMenu: MenuItem_t[],
    onPageSelected: (pageIndex: number) => void,
    onRowSelected: (rowIndex: number) => void,
    onMenuSelected: OnMenuSelected,
    onSortColumnSelected: OnSortColumnSelected_t,
    className: string,
    rowStyle    : (i: number) => any
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
    }
    return c.sortable ? __(FontIcon, { onClick: () => { onSortColumnSelected(0, c.name, nextSort) }, className: `header-icon fa fa-${iconName}` }) : undefined;
}

export function DocList({columns, data, pager, onPageSelected, rowMenu, onRowSelected, onMenuSelected, onSortColumnSelected, className, rowStyle}: DocList_t): ReactElement<any> {
    const header = _.thead({ key: 'header' }, [_.tr({ key: 'head' }, [_.th({ key: 'Menu' }, ''), ...columns.map(c => _.th({ key: c.name + c.label }, [sortIcon(c, onSortColumnSelected), c.label]))])]);
    const style = rowStyle ? rowStyle : (i: number) => ({});
    const bodycontent = data.map((row, i) => _.tr({ style: style(i), key: i }, [
        _.td({ key: '_menu' }, __(RowMenu, { rowIndex: i, menuItems: rowMenu, onMenuSelected: onMenuSelected })),
        ...columns.map(col => _.td({ key: col.name + col.label, onClick: () => onRowSelected(i) }, col.format ? col.format(row[col.name], row) : row[col.name]))
    ]));
    const body = _.tbody({ key: 'body' }, bodycontent);
    const tableProps = { key: "table", className: className || 'table table-hover table-striped table-mc-purple table-condensed' };
    const table = _.table(tableProps, [header, body]); // table
    const pagerComponent = __(Pager, { totalItems: pager.totalItems, pageSize: pager.pageSize, selected: pager.selected, pageSelected: onPageSelected });
    return _.div({ className: 'doclist' }, pager.totalItems > 0 ? [pagerComponent, table] : []);
}

