import { Fade, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, withStyles } from "@material-ui/core";
import ArrowRight from "@material-ui/icons/ArrowRight";
import MoreVert from "@material-ui/icons/MoreVert";
import FontIcon from "material-ui/FontIcon";
import { Component, createElement as __, Fragment, MouseEvent, ReactElement } from "react";

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
    inset: boolean,
    onMenuSelected: (menuIdx: number, key?: string) => void,
    onOpenSubMenu?: (event: MouseEvent<HTMLElement>) => void,
    onCloseSubMenu?: () => void,
};

type SubMenuItem_State_t = {
    anchorEl: HTMLElement | null,
};

const whiteIconButtonStyle = {
    root: {
        color: "white",
    },
};

const WhiteIconButton = withStyles(whiteIconButtonStyle)(IconButton);

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

    private menuItemsNeedInset() {
        return this.props.menuItem.children!.find((menuItem) => !!menuItem.iconName) !== undefined;
    }

    public render() {
        return __(Fragment, { key: this.props.idx }, [
            this.props.rootMenu ?
                __(WhiteIconButton, {
                    key: "button",
                    onClick: (event: MouseEvent<HTMLElement>) => this.setState({ anchorEl: event.currentTarget }),
                }, __(MoreVert))
                : __(MenuItemWrapper, {
                    key: "wrapper",
                    idx: this.props.idx,
                    inset: this.props.inset,
                    menuItem: this.props.menuItem,
                    onMenuSelected: this.props.onMenuSelected,
                    onOpenSubMenu: (event: MouseEvent<HTMLElement>) => this.setState({ anchorEl: event.currentTarget }),
                    onCloseSubMenu: () => this.onClose(),
                }),
            __(Menu, {
                key: "menu",
                className: "pagemenu-menu",
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
            }, this.props.menuItem.children!.map((m, i) => __(MenuItemSwitcher, {
                key: i,
                idx: i,
                menuItem: m,
                inset: this.menuItemsNeedInset(),
                onCloseSubMenu: () => this.onClose(),
                onMenuSelected: (menuIdx: number, key?: string) => {
                    this.props.onMenuSelected(menuIdx, key);
                    this.onClose();
                },
            }))),
        ]);

    }
}

function MenuItemWrapper({ idx, menuItem, onMenuSelected, onOpenSubMenu, inset }: MenuItemWrapper_t): ReactElement<any> {
    return __(MenuItem, {
        className: "pagemenu-item " + (onOpenSubMenu ? "pagemenu-item-submenu" : ""),
        onClick: (event: MouseEvent<HTMLElement>) => onOpenSubMenu ? onOpenSubMenu(event) : onMenuSelected(idx, menuItem.key),
    }, [
            menuItem.iconName && __(ListItemIcon, {
                key: "icon",
                children: __(FontIcon, { className: `fa ${menuItem.iconName}` }),
            }),
            __(ListItemText, {
                key: "text",
                className: "pagemenu-label",
                primary: menuItem.label,
                secondary: menuItem.secondaryLabel,
                inset,
            }),
            onOpenSubMenu && __(ArrowRight, {
                key: "expand",
            }),
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
        key: 0,
        inset: false,
        menuItem: {
            label: "ROOT",
            children: props.menuItems,
        },
        onMenuSelected: props.onMenuSelected,
    });
}
