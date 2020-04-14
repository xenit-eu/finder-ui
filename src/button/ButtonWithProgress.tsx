import { CircularProgress, Theme, withStyles, WithStyles } from "@material-ui/core";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import classnames from "classnames";
import * as React from "react";
import ButtonWithIcon, { ButtonWithIcon_Props_t } from "./ButtonWithIcon";

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
    isLoading: boolean | { progress: number },
} & WithStyles<typeof styles> & ButtonWithIcon_Props_t;
function ButtonWithProgress(props: ButtonWithProgress_Props_t) {
    const { isLoading, classes, className, ...buttonProps } = props;
    const { root, progress, ...buttonClasses } = classes;
    return <div className={classnames(root, className)}>
        <ButtonWithIcon
            {...buttonProps}
            classes={buttonClasses}
            disabled={buttonProps.disabled || !!isLoading}
        />
        {isLoading && <CircularProgress
            size={24}
            className={progress}
            variant={isLoading === true ? "indeterminate" : "determinate"}
            value={isLoading !== true ? isLoading.progress : undefined}
        />}
    </div>;
}

export default withStyles(styles, { name: "FinderButtonWithProgress" })(ButtonWithProgress);
