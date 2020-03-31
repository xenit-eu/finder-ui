import { Button, IconButton, ListItemIcon, ListItemText, MenuItem } from "@material-ui/core";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import * as React from "react";
import PopupMenu from "./PopupMenu";
interface IMenuItem {
    icon?: React.ReactElement;
    label: string;
    onClick?: () => void;
    disabled?: boolean;
}

const overflowMenuStyles = {
    root: {
        display: "flex",
    },
};

type OverflowMenu_Props_t = {
    items: readonly IMenuItem[],
    menuIcon: React.ReactElement,
    maxItems: number,
} & WithStyles<typeof overflowMenuStyles>;

function OverflowMenu(props: OverflowMenu_Props_t) {
    // If we need to add a menu button, reduce visible items by one,
    // so the menu button can also take up a space
    const numberOfVisibleItems = Math.max(0, props.items.length > props.maxItems ? props.maxItems - 1 : props.maxItems);
    const visibleItems = props.items.slice(0, numberOfVisibleItems);
    const menuItems = props.items.slice(numberOfVisibleItems);

    const hasMenu = menuItems.length > 0;

    return <div className={props.classes.root}>
        {visibleItems.map((item, i) => <OverflowMenuVisibleItem item={item} key={i} />)}
        {hasMenu && <PopupMenu icon={props.menuIcon}>
            {(closeMenu) => menuItems.map((item, i) => <OverflowMenuMenuItem item={item} closeMenu={closeMenu} key={i} />)}
        </PopupMenu>}
    </div>;
}

export default withStyles(overflowMenuStyles, { name: "FinderOverflowMenu" })(OverflowMenu);

function OverflowMenuVisibleItem({ item }: { item: IMenuItem }) {
    const commonProps = { onClick: item.onClick, disabled: item.disabled };
    if (item.icon) {
        return <IconButton aria-label={item.label} {...commonProps}>
            {item.icon}
        </IconButton>;
    } else {
        return <Button {...commonProps}>{item.label}</Button>;
    }
}

function OverflowMenuMenuItem({ item, closeMenu }: { item: IMenuItem, closeMenu: () => void }) {
    return <MenuItem
        onClick={() => {
            if (item.onClick) {
                item.onClick();
            }
            closeMenu();
        }}
        disabled={item.disabled}
    >
        {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
        <ListItemText primary={item.label} />
    </MenuItem>;
}
