import { Theme, withStyles, WithStyles } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import classnames from "classnames";
import React, { cloneElement, HTMLProps, ReactElement} from "react";
import StopPropagation from "../../util/StopPropagation";
import useKeypressHandler from "./useKeypressHandler";

// tslint:disable-next-line
interface ChipIconButton_Props_t extends HTMLProps<HTMLElement> {
    readonly color?: "primary" | "secondary" | "inherit";
    readonly disabled?: boolean;
    readonly onClick: () => void;
    readonly children: ReactElement;
}

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
        "&:first-child": {
            marginLeft: -theme.spacing.unit,
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
function ChipIconButton({classes, disabled, onClick, color, className, ...props}: ChipIconButton_Props_t & WithStyles<typeof styles>) {
    const iconChild = React.Children.only(props.children);
    const onKeyPress = useKeypressHandler({
        onCommit: onClick,
        stopPropagation: true,
    });
    const iconClone = cloneElement(iconChild, {
        "className": classnames(iconChild.props.className, classes.root, {
            [classes.rootPrimary]: color === "primary",
            [classes.rootSecondary]: color === "secondary",
            [classes.rootInherit]: color === "inherit",
            [classes.disabled]: disabled ?? false,
        }, className),
        "onClick": disabled ? undefined : onClick,
        "onKeyPress": disabled ? undefined : onKeyPress,
        "focusable": !disabled,
        "role": "button",
        "aria-hidden": false,
        "aria-disabled": !!disabled,
        "tabIndex": 0,

        ...props,
    });
    return <StopPropagation events={["onKeyDown", "onKeyPress", "onKeyUp"]}>{iconClone}</StopPropagation>;
}

export default withStyles(styles)(ChipIconButton);
