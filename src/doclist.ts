import { DOM as _, createElement as __, ReactElement } from 'react';
import { Pager, Pager_t } from './pager'

import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreHorizIcon from 'material-ui/svg-icons/navigation/more-horiz';

import "./doclist.less";

type OnMenuSelected = (rowIndex : number, menuIndex : number, key? : string ) => void;

export type MenuItem_t = {
    key? : string,
    label: string
};

type RowMenu_t = {
    rowIndex: number,
    menuItems: MenuItem_t[],
    onMenuSelected : OnMenuSelected
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

export enum SortDirection_t {
    NONE,
    ASC,
    DESC
};

export type Column_t = {
    name: string,
    label: string,
    alignRight: boolean,
    sortable: boolean,
    sortDirection: SortDirection_t,
};

export type DocList_t = {
    columns: Column_t[],
    data: { [k: string]: string }[],
    pager: Pager_t,
    rowMenu: MenuItem_t[],
    onPageSelected : (pageIndex : number) => void,
    onRowSelected: (rowIndex: number) => void,
    onMenuSelected: OnMenuSelected,
    onSortColumnSelected: (columnIndex : number, columnName : string, direction : SortDirection_t) => void
};

export function DocList({columns, data, pager, onPageSelected, rowMenu, onRowSelected, onMenuSelected, onSortColumnSelected}: DocList_t) : ReactElement<any> {
    return _.div({ className: 'doclist' }, pager.totalItems ? [
        __(Pager, { totalItems: pager.totalItems, pageSize: pager.pageSize, selected: pager.selected, pageSelected: onPageSelected }),
        _.table({ key: "table", className: 'table table-hover table-striped table-mc-purple table-condensed' }, [
            _.thead({ key: 'header' }, [
                _.tr({key:'head'}, [_.th({ key: 'Menu' }, ''), ...columns.map(c => _.th({ key: c.name }, c.label))])
            ]),
            _.tbody({ key: 'body' },
                data.map((row, i) => _.tr({ key: i, onClick: () => onRowSelected(i) }, [
                    _.td({key: '_menu'}, __(RowMenu, { rowIndex: i, menuItems: rowMenu, onMenuSelected: onMenuSelected })), 
                    ...columns.map(col => _.td({ key: col.name }, row[col.name]))
                ]))
            )
        ]) // table
    ] : []
    );

}

