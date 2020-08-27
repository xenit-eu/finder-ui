import { Collapse, Paper, Theme, WithStyles, withStyles } from "@material-ui/core";
import React, { useLayoutEffect, useRef, useState } from "react";
import { findDOMNode } from "react-dom";
import useKeypressHandler from "../chips/useKeypressHandler";

type AutocompletePaper_Props_t = {
    target: React.ReactNode,
    children: React.ReactNode,
    onDismiss: () => void,
    open: boolean,
};

const styles = (theme: Theme) => ({
    root: {
    },
    paper: {
        maxHeight: "100vh",
        overflow: "auto",
    },
    collapseInner: {
        marginTop: 4,
        marginBottom: 6,
        marginLeft: 3,
        marginRight: 3,
    },
    collapse: {
        marginTop: -4,
        marginBottom: -6,
        marginLeft: -3,
        marginRight: -3,
        position: "relative" as const,
    },
});

function AutocompletePaper(props: AutocompletePaper_Props_t & WithStyles<typeof styles>) {
    const collapseElem = useRef<HTMLDivElement>();
    const [maxHeight, setMaxHeight] = useState(0);
    useLayoutEffect(() => {
        if (collapseElem.current) {
            const domElem = findDOMNode(collapseElem.current) as HTMLElement | null;
            if (!domElem) {
                return;
            }
            const offsetParent = domElem.offsetParent as HTMLElement | null;
            if (offsetParent) {
                const newMaxHeight = Math.max(offsetParent.offsetHeight - domElem.offsetTop - 40, 200);
                if (maxHeight !== newMaxHeight && newMaxHeight > 0) {
                    setMaxHeight(newMaxHeight);
                }
            }
        }
    });
    const onKeyUp = useKeypressHandler({
        onExit: props.onDismiss,
    });
    return <div className={props.classes.root}>
        {props.target}
        <Collapse in={props.open} className={props.classes.collapse} classes={{
            wrapperInner: props.classes.collapseInner,
        }} innerRef={collapseElem}>
            <Paper elevation={2} className={props.classes.paper} style={{ maxHeight }} onKeyUp={onKeyUp}>
                {props.children}
            </Paper>
        </Collapse>
    </div>;
}

export default withStyles(styles)(AutocompletePaper);
