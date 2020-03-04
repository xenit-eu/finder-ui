import * as React from "react";
import { Theme, WithStyles, withStyles } from "@material-ui/core/styles";
import classnames from "classnames";
import { CSSProperties } from "@material-ui/core/styles/withStyles";

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
