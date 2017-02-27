
import { DOM as _, createElement as __, ReactElement } from 'react';

import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import FontIcon from 'material-ui/FontIcon';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';


export type MenuItem_t = {
    key?: string,
    label: string,
    iconName?: string,  // font-awesome name.
    children?: MenuItem_t[]
};

export type PageMenu_t = {
    menuItems: MenuItem_t[],
    onMenuSelected: (menuIdx: number, key? : string) => void
};

export type PageMenuItem_t = {
    idx : number,
    menuItem: MenuItem_t,
    onMenuSelected: (menuIdx: number, key? : string) => void
};

function PageMenuItem({idx, menuItem, onMenuSelected} : PageMenuItem_t) : ReactElement<any> {
    return __(MenuItem, { 
        key: menuItem.key, 
        leftIcon: menuItem.iconName !== undefined ? __(FontIcon, {className:`fa ${menuItem.iconName}`}) : undefined,
        rightIcon: menuItem.children !== undefined &&  menuItem.children.length > 0 ?  __(ArrowDropRight) : undefined,
        primaryText: menuItem.label, 
        onTouchTap: () => onMenuSelected(idx, menuItem.key),
        menuItems: menuItem.children !== undefined ?  menuItem.children.map((mi, i) => PageMenuItem({idx: (idx*100)+i, menuItem: mi, onMenuSelected: onMenuSelected})) : []
    });
}

export function PageMenu({menuItems, onMenuSelected} : PageMenu_t) : ReactElement<any> {
    return __(IconMenu, {
            iconButtonElement: __(IconButton, {}, __(MoreVertIcon, { color: 'white' })),
            targetOrigin: { horizontal: 'left', vertical: 'top' },
            anchorOrigin: { horizontal: 'left', vertical: 'top' },
        }, menuItems.map((m, i) => PageMenuItem({idx: i, menuItem: m, onMenuSelected: onMenuSelected })
    )); 
}

