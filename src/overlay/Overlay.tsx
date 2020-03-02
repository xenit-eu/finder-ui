import * as React from "react";
import { Theme, WithStyles, withStyles } from "@material-ui/core/styles";
import * as classnames from "classnames";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import OverlayCentered from "./OverlayCentered";

type Overlay_Props_t = {
    open: boolean,
    overlay?: React.ReactNode,
    centered?: boolean,
    children?: React.ReactNode,
};

const overlayStyle = (theme: Theme) => ({
    root: {
        position: "relative",

    } as CSSProperties,
    overlay: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        color: theme.palette.getContrastText("rgba(0,0,0,0.5)"),
        zIndex: theme.zIndex.tooltip,
    } as CSSProperties,
    overlayHidden: {
        display: "none",
    } as CSSProperties,
});

function Overlay(props: Overlay_Props_t & WithStyles<typeof overlayStyle>) {
    let overlay = null;
    if (props.overlay) {
        overlay = props.overlay;
        if (props.centered) {
            overlay = <OverlayCentered>{overlay}</OverlayCentered>

        }
    }
    return <div className={props.classes.root}>
        {overlay ? <div className={classnames(
            props.classes.overlay, {
            [props.classes.overlayHidden]: !props.open,
        })}>
            {overlay}
        </div> : null}
        {...React.Children.toArray(props.children)}
    </div>;
}

export default withStyles(overlayStyle, { name: "FinderOverlay" })(Overlay);
