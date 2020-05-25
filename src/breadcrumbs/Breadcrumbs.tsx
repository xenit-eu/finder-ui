import ButtonBase from "@material-ui/core/ButtonBase";
import { Theme, withStyles, WithStyles } from "@material-ui/core/styles";
import type { CSSProperties } from "@material-ui/core/styles/withStyles";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import BreadcrumbsBase, { BreadcrumbsBase_Props_t } from "./BreadcrumbsBase";
type Breadcrumbs_Props_t = BreadcrumbsBase_Props_t & {
    maxItems?: number | null,
};

export default function Breadcrumbs({ maxItems = 5, children, ...props }: Breadcrumbs_Props_t) {
    let childArray = React.Children.toArray(children);
    const [collapsed, setCollapsed] = useState(true);
    const uncollapse = useCallback(() => setCollapsed(false), [setCollapsed]);

    if (maxItems !== null && childArray.length > maxItems && collapsed) {

        childArray = [
            childArray[0],
            <CollapsedBreadcrumb onClick={uncollapse} />,
            childArray[childArray.length - 1],
        ];
    }

    return <BreadcrumbsBase {...props} children={childArray} />;
}

const collapsedBreadcrumbStyle = (theme: Theme) => ({
    button: {
        "display": "flex",
        "marginLeft": theme.spacing.unit * 0.5,
        "marginRight": theme.spacing.unit * 0.5,
        "backgroundColor": theme.palette.grey[100],
        "color": theme.palette.grey[700],
        "borderRadius": 2,
        "cursor": "pointer",
        "&:hover, &:focus": {
            backgroundColor: theme.palette.grey[200],
        },
        "&:active": {
            boxShadow: theme.shadows[0],
            backgroundColor: theme.palette.grey[200],
        },
    } as CSSProperties,
    icon: {
        width: 24,
        height: 16,
    } as CSSProperties,

});

type CollapsedBreadcrumb_Props_t = {
    onClick: () => void,
};
function CollapsedBreadcrumb_(props: CollapsedBreadcrumb_Props_t & WithStyles<typeof collapsedBreadcrumbStyle>) {
    const { t } = useTranslation("finder-ui");
    return <ButtonBase onClick={props.onClick} className={props.classes.button} focusRipple>
        <MoreHorizIcon className={props.classes.icon} aria-label={t("breadcrumbs/Breadcrumbs/expand")} />
    </ButtonBase>;
}
const CollapsedBreadcrumb = withStyles(collapsedBreadcrumbStyle)(CollapsedBreadcrumb_);
