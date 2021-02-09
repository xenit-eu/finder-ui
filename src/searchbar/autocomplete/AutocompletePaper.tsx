import { Collapse, Paper, Popper, Theme, WithStyles, withStyles } from "@material-ui/core";
import debug from "debug";
import React, { useEffect, useRef, useState } from "react";
import { findDOMNode } from "react-dom";
import sizeMe from "react-sizeme";
import useKeypressHandler from "../chips/useKeypressHandler";
const d = debug("finder-ui:searchbar:autocomplete:AutocompletePaper");

type AutocompletePaper_Props_t = {
    target: React.ReactNode,
    children: React.ReactNode,
    onDismiss: () => void,
    open: boolean,
};

const styles = (theme: Theme) => ({
    root: {
    },
    target: {

    },
    popover: {
        zIndex: theme.zIndex.tooltip,
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

const DivWithSize = sizeMe({ noPlaceholder: true, monitorWidth: true, monitorHeight: false, monitorPosition: false })(({ size, ...props }: any) => <div {...props} />);

function calculateElementTop(element: HTMLElement|null) {
    let size = 0;
    if (element) {

        do {
            size += element.offsetTop;
        // tslint:disable-next-line
        } while ((element = element.offsetParent as HTMLElement | null));

    }
    return size;
}

function calculateMaxHeight({ windowHeight, elemHeight, elemTop }: Record<"windowHeight"| "elemHeight"| "elemTop", number | null | undefined>) {
    const maxHeight = (windowHeight ?? 0) - ((elemHeight ?? 0) + (elemTop ?? 0)) - 40;
    return Math.max(maxHeight, 200);
}

function AutocompletePaper(props: AutocompletePaper_Props_t & WithStyles<typeof styles>) {
    const collapseRctElem = useRef<React.ReactInstance>();
    const rootElem = useRef<HTMLDivElement|null>(null);
    const [targetElem, setTargetElem] = useState<HTMLDivElement|null>(null);
    const [autocompleteMaxHeight, setAutocompleteMaxHeight] = useState(200);
    const [autocompleteWidth, setAutocompleteWidth] = useState<number>();
    const onKeyUp = useKeypressHandler({
        onExit: props.onDismiss,
    });

    useEffect(() => {
        function resizeSubscriber() {
            setAutocompleteMaxHeight(calculateMaxHeight({
                windowHeight: window.innerHeight,
                elemHeight: targetElem?.offsetHeight,
                elemTop: calculateElementTop(targetElem),
            }));
        }

        resizeSubscriber();
        window.addEventListener("resize", resizeSubscriber);
        return () => window.removeEventListener("resize", resizeSubscriber);
    }, [setAutocompleteMaxHeight, targetElem]);

    useEffect(() => {
        function handleClickOutside(ev: MouseEvent) {
            d("Received click on node %o", ev.target);
            if (!rootElem.current || rootElem.current.contains(ev.target as Node)) {
                d("Node %o is part of %o: not outside ourself", ev.target, rootElem.current);
                return;
            }
            const collapseElem = collapseRctElem.current ? findDOMNode(collapseRctElem.current) : null;
            if (!collapseElem || collapseElem.contains(ev.target as Node)) {
                d("Node %o is part of %o: not outside ourself", ev.target, collapseElem);
                return;
            }
            d("Node %o is outside ourself: dismissing paper");

            if (props.onDismiss) {
                props.onDismiss();
            }
        }
        document.addEventListener("click", handleClickOutside, { capture: true });
        return () => document.removeEventListener("click", handleClickOutside, { capture: true });
    }, [rootElem, collapseRctElem, props.onDismiss, document]);

    return <div className={props.classes.root} ref={rootElem}>
        <DivWithSize className={props.classes.target} ref={(e: any) => setTargetElem(findDOMNode(e) as HTMLDivElement)} onSize={({ width }) => {
            setAutocompleteWidth(width ?? undefined);
        }}>
            {props.target}
        </DivWithSize>
        <Popper anchorEl={targetElem} open={props.open} className={props.classes.popover} placement="bottom-start" transition>
            {({ TransitionProps }) => <Collapse className={props.classes.collapse} classes={{
                    wrapperInner: props.classes.collapseInner,
                }} innerRef={collapseRctElem} {...TransitionProps}>
                    <Paper elevation={2} className={props.classes.paper} style={{
                        width: autocompleteWidth,
                        maxHeight: autocompleteMaxHeight,
                    }} onKeyUp={onKeyUp}>
                        {props.children}
                    </Paper>
                </Collapse>
            }
        </Popper>
    </div>;
}

export default withStyles(styles)(AutocompletePaper);
