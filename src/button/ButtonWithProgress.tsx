import { Button, CircularProgress, Theme, withStyles, WithStyles } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import * as React from "react";

const styles = (theme: Theme) => ({
    root: {
        display: "inline-block",
        position: "relative",
    } as CSSProperties,
    progress: {
        position: "absolute",
        top: "50%",
        left: "50%",
        marginTop: -12,
        marginLeft: -12,

    } as CSSProperties,
});

export type ButtonWithProgress_Props_t = {
    isLoading: boolean,
} & WithStyles<typeof styles> & ButtonProps;
function ButtonWithProgress(props: ButtonWithProgress_Props_t) {
    const { isLoading, classes, ...buttonProps } = props;
    const { root, progress, ...buttonClasses } = classes;
    return <div className={root}>
        <Button
            {...buttonProps}
            classes={buttonClasses}
            disabled={buttonProps.disabled || isLoading}
        />
        {isLoading && <CircularProgress size={24} className={progress} />}
    </div>
}

export default withStyles(styles, { name: "FinderButtonWithProgress" })(ButtonWithProgress);
