import { Theme, WithStyles, withStyles } from "@material-ui/core";
import Button, { ButtonProps } from "@material-ui/core/Button";
import classnames from "classnames";
import * as React from "react";

export type ButtonWithIcon_Props_t = {
    icon?: React.ReactElement,
} & ButtonProps & WithStyles<typeof buttonWithIconStyles>;

const buttonWithIconStyles = (theme: Theme) => ({
    icon: {
        marginRight: theme.spacing.unit,
    },
    iconSmall: {
        fontSize: 18,

    },
    iconMedium: {
        fontSize: 20,

    },
    iconLarge: {
        fontSize: 24,
    },
    iconLargeOutlined: {
        fontSize: 20,
    },
});

function capitalize(s: string): string {
    return s[0].toUpperCase() + Array.prototype.slice.call(s, 1).join("");
}

function filterObject(o: object, keyFilter: (key: string) => boolean): object {
    const newObject = { ...o };
    Object.keys(newObject)
        .filter((key) => !keyFilter(key))
        .forEach((key) => delete newObject[key]);
    return newObject;
}

function ButtonWithIcon({ icon = undefined, children, classes, ...props }: ButtonWithIcon_Props_t) {
    const { size = "medium", variant = "text" } = props;
    const buttonClasses = filterObject(classes, (clazz) => !clazz.startsWith("icon"));
    const patchedIcon = icon ? React.cloneElement(icon, {
        className: classnames(
            icon.props.className,
            classes.icon,
            classes["icon" + capitalize(size)],
            classes["icon" + capitalize(size) + capitalize(variant)],
        ),
        role: icon.props.role || "presentation",
    }) : null;

    return <Button {...props} classes={buttonClasses}>{patchedIcon}{children}</Button>;

}

export default withStyles(buttonWithIconStyles)(ButtonWithIcon);
