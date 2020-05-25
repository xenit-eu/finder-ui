import { Theme, WithStyles, withStyles } from "@material-ui/core/styles";
import { SvgIconProps } from "@material-ui/core/SvgIcon";
import React from "react";

const styles = (theme: Theme) => ({
    root: {
        fontSize: theme.typography.pxToRem(80),
    },
});

type LargeIcon_Props_t = {
    children: React.ReactElement<SvgIconProps>,
} & WithStyles<typeof styles>;

function LargeIcon(props: LargeIcon_Props_t) {
    const icon = React.Children.only(props.children);
    const inheritIcon = React.cloneElement(icon, { fontSize: "inherit" });
    return <span className={props.classes.root}>
        {inheritIcon}
    </span>;
}

export default withStyles(styles, { name: "FinderLargeIcon" })(LargeIcon);
