
import { Component, createElement as __, Fragment, MouseEvent, ReactElement } from "react";
import * as _ from "react-dom-factories";

import { Fade, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, withStyles } from "@material-ui/core";
import { ArrowRight, MoreVert } from "@material-ui/icons";
import FontIcon from "material-ui/FontIcon";

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
    onMenuSelected: (menuIdx: number, key?: string) => void,
    onOpenSubMenu?: (event: MouseEvent<HTMLElement>) => void,
    onCloseSubMenu?: () => void,
};

class SubMenuItem extends Component<MenuItemWrapper_t, PageMenu_State_t> {
    public state: PageMenu_State_t = {
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
            __(MenuItemWrapper, {
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

type PageMenu_State_t = {
    anchorEl: HTMLElement | null,
};

class PageMenuInternal extends Component<PageMenu_t & { classes: { menuButton: string } }, PageMenu_State_t> {
    public state: PageMenu_State_t = {
        anchorEl: null,
    };

    private onClose() {
        this.setState({ anchorEl: null });
    }

    public render() {
        return _.div({}, [
            __(IconButton, {
                key: "button",
                className: this.props.classes.menuButton,
                onClick: (event: MouseEvent<HTMLElement>) => this.setState({ anchorEl: event.currentTarget }),
            }, __(MoreVert)),
            __(Menu, {
                TransitionComponent: Fade,
                anchorEl: this.state.anchorEl,
                open: this.state.anchorEl !== null,
                onClose: () => this.onClose(),
            }, this.props.menuItems.map((m, i) => MenuItemSwitcher({
                idx: i,
                menuItem: m,
                onMenuSelected: (menuIdx: number, key?: string) => {
                    this.props.onMenuSelected(menuIdx, key);
                    this.onClose();
                },
                onCloseSubMenu: () => this.onClose(),
            }))),
        ]);
    }
}

const PageMenuStyled = withStyles(theme => ({
    menuButton: {
        color: "white",
    },
}))(PageMenuInternal);

export function PageMenu(props: PageMenu_t): ReactElement<any> {
    return __(PageMenuStyled, props);
}
