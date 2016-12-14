
import { DOM as _, createElement as __, ReactElement } from 'react';

import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

export type MenuItem_t = {
    key?: string,
    label: string,
};

export type PageMenu_t = {
    menuItems: MenuItem_t[],
    onMenuSelected: (menuIdx: number, key? : string) => void
};

export function PageMenu({menuItems, onMenuSelected} : PageMenu_t) {
    return __(IconMenu, {
        iconButtonElement: __(IconButton, {}, __(MoreVertIcon, { color: 'white' })),
        targetOrigin: { horizontal: 'left', vertical: 'top' },
        anchorOrigin: { horizontal: 'left', vertical: 'top' },
    }, menuItems.map((m, i) =>  __(MenuItem, { key: "m"+i, primaryText: m.label, onTouchTap: () => onMenuSelected(i, m.key) })  )); 
}

