import { Theme, withStyles, WithStyles } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import classnames from "classnames";
import React, { cloneElement, ReactElement } from "react";

type ChipIconButton_Props_t = {
    readonly color?: "primary" | "secondary" | "inherit",
    readonly disabled?: boolean,
    readonly onClick: () => void;
    readonly children: ReactElement;
};

const styles = (theme: Theme) => ({
    root: {
        "WebkitTapHighlightColor": "transparent",
        "color": theme.palette.text.primary,
        "cursor": "pointer",
        "height": "auto",
        "marginLeft": theme.spacing.unit / 2,
        "&:hover, &:focus": {
            color: fade(theme.palette.text.primary, 0.4),
        },
        "&:last-child": {
            marginRight: -theme.spacing.unit,
        },
    },
    rootPrimary: {
        "color": theme.palette.primary.main,
        "&:hover, &:focus": {
            color: fade(theme.palette.primary.main, 0.4),
        },
    },
    rootSecondary: {

        "color": theme.palette.secondary.main,

        "&:hover, &:focus": {
            color: fade(theme.palette.secondary.main, 0.4),
        },
    },
    rootInherit: {
        "color": "inherit",
        "&:hover, &:focus": {
            color: "inherit",
            opacity: 0.9,
        },
    },
    disabled: {
        "cursor": "not-allowed",
        "opacity": 0.5,
        "&:hover, &:focus": {
            color: "unset",
            opacity: 0.5,
        },
    },

});
function ChipIconButton(props: ChipIconButton_Props_t & WithStyles<typeof styles>) {
    const iconChild = React.Children.only(props.children);
    return cloneElement(iconChild, {
        "className": classnames(iconChild.props.className, props.classes.root, {
            [props.classes.rootPrimary]: props.color === "primary",
            [props.classes.rootSecondary]: props.color === "secondary",
            [props.classes.rootInherit]: props.color === "inherit",
            [props.classes.disabled]: props.disabled ?? false,
        }),
        "onClick": props.disabled ? undefined : props.onClick,
        "focusable": !props.disabled,
        "role": "button",
        "aria-hidden": false,
        "aria-disabled": !!props.disabled,
        "tabindex": 0,
    });
}

export default withStyles(styles)(ChipIconButton);
