import { Theme, WithStyles, withStyles } from "@material-ui/core/styles";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import classnames from "classnames";
import * as React from "react";

const overlayCenteredStyle = {
    root: {
        margin: "auto",
        display: "flex",
        alignItems: "center",
        height: "100%",
    },
    centered: {
        alignSelf: "center",
        margin: "auto",
    },
};

type OverlayCentered_Props_t = {
    children: React.ReactNode,
} & React.HTMLAttributes<HTMLDivElement>;
function OverlayCenteredInternal({ classes, children, ...props }: OverlayCentered_Props_t & WithStyles<typeof overlayCenteredStyle>) {
    return <div className={classnames(props.className, classes.root)} {...props}>
        <div className={classes.centered} children={children} />
    </div>;
}
export default withStyles(overlayCenteredStyle, { name: "FinderOverlayCentered" })(OverlayCenteredInternal);
