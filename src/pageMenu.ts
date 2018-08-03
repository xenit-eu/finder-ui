
import { Component, createElement as __, Fragment, MouseEvent, ReactElement } from "react";
import * as _ from "react-dom-factories";

import { Fade, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, withStyles } from "@material-ui/core";
import { ArrowRight, MoreVert } from "@material-ui/icons";
import FontIcon from "material-ui/FontIcon";
import { IconButtonProps } from "@material-ui/core/IconButton";

export type PageMenuItem_t = {
    key?: string,
    label: string,
    secondaryLabel?: string,
    iconName?: string,  // font-awesome name.
    children?: PageMenuItem_t[],  // recursive possible.
};

export type PageMenu_t = {
    menuItems: PageMenuItem_t[],
    onMenuSelected: (menuIdx: number, key?: string) => void,
};

type MenuItemWrapper_t = {
    idx: number,
    menuItem: PageMenuItem_t,
    rootMenu?: boolean,
    onMenuSelected: (menuIdx: number, key?: string) => void,
    onOpenSubMenu?: (event: MouseEvent<HTMLElement>) => void,
    onCloseSubMenu?: () => void,
};

type SubMenuItem_State_t = {
    anchorEl: HTMLElement | null,
};

const WhiteIconButton = withStyles({
    root: {
        color: "white",
    },
})((props: IconButtonProps) => __(IconButton, props));

class SubMenuItem extends Component<MenuItemWrapper_t, SubMenuItem_State_t> {
    public state: SubMenuItem_State_t = {
        anchorEl: null,
    };

    private onClose() {
        this.setState({ anchorEl: null });
        if (this.props.onCloseSubMenu) {
            this.props.onCloseSubMenu();
        }
    }

    public render() {
        return __(Fragment, {}, [
            this.props.rootMenu ?
                __(WhiteIconButton, {
                    key: "button",
                    onClick: (event: MouseEvent<HTMLElement>) => this.setState({ anchorEl: event.currentTarget }),
                }, __(MoreVert))
                : __(MenuItemWrapper, {
                    idx: this.props.idx,
                    menuItem: this.props.menuItem,
                    onMenuSelected: this.props.onMenuSelected,
                    onOpenSubMenu: (event: MouseEvent<HTMLElement>) => this.setState({ anchorEl: event.currentTarget }),
                    onCloseSubMenu: () => this.onClose(),
                }),
            __(Menu, {
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right",
                },
                transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                },
                open: this.state.anchorEl !== null,
                anchorEl: this.state.anchorEl,
                onClose: () => this.onClose(),
                TransitionComponent: Fade,
            }, this.props.menuItem.children!.map((m, i) => MenuItemSwitcher({
                idx: i,
                menuItem: m,
                onCloseSubMenu: () => this.onClose(),
                onMenuSelected: (menuIdx: number, key?: string) => {
                    this.props.onMenuSelected(menuIdx, key);
                    this.onClose();
                },
            }))),
        ]);

    }
}

function MenuItemWrapper({ idx, menuItem, onMenuSelected, onOpenSubMenu }: MenuItemWrapper_t): ReactElement<any> {
    return __(MenuItem, {
        key: idx,
        onClick: (event: MouseEvent<HTMLElement>) => onOpenSubMenu ? onOpenSubMenu(event) : onMenuSelected(idx, menuItem.key),
    }, [
            menuItem.iconName && __(ListItemIcon, undefined, __(FontIcon, { className: `fa ${menuItem.iconName}` })),
            __(ListItemText, {
                primary: menuItem.label,
                secondary: menuItem.secondaryLabel,
                inset: true,
            }),
            onOpenSubMenu && __(ArrowRight),
        ]);
}

function MenuItemSwitcher(props: MenuItemWrapper_t): ReactElement<any> {
    if (props.menuItem.children && props.menuItem.children.length) {
        return __(SubMenuItem, props);
    } else {
        return __(MenuItemWrapper, props);
    }
}

export function PageMenu(props: PageMenu_t): ReactElement<any> {
    return __(SubMenuItem, {
        rootMenu: true,
        idx: 0,
        menuItem: {
            label: "ROOT",
            children: props.menuItems
        },
        onMenuSelected: props.onMenuSelected,
    });
}
