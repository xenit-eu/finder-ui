import { IconButton, Menu } from "@material-ui/core";
import * as React from "react";
import { useTranslation } from "react-i18next";
import useUuid from "../util/hooks/useUuid";

type PopupMenu_Props_t = {
    icon: React.ReactElement,
    children: (closeMenu: () => void) => React.ReactElement[],
};
export default function PopupMenu(props: PopupMenu_Props_t) {
    const menuId = useUuid("menu-PopupMenu-");
    const [anchorElement, setAnchorElement] = React.useState<HTMLElement | null>(null);
    const open = !!anchorElement;
    const { t } = useTranslation("finder-ui");
    const onClose = () => setAnchorElement(null);
    return <div>
        <IconButton
            aria-label={t("menu/PopupMenu/more")}
            aria-owns={open ? menuId : undefined}
            aria-haspopup="true"
            onClick={(event: React.MouseEvent<HTMLElement>) => setAnchorElement(event.currentTarget)}
            disabled={open}
        >{props.icon}</IconButton>
        <Menu
            open={open}
            anchorEl={anchorElement}
            id={menuId}
            onClose={onClose}
        >
            {props.children(onClose)}
        </Menu>
    </div>;

}
