import { Backdrop, Collapse, Paper, Popper, Theme, WithStyles, withStyles } from "@material-ui/core";
import debug from "debug";
import FocusTrap from "focus-trap-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
    backdrop: {
        zIndex: 0,

        backgroundColor: "rgba(0, 0, 0, 0.25)",
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
    const [collapseElem, setCollapseElem] = useState<HTMLElement | null>(null);
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

    const onDismiss = useCallback(() => props.onDismiss(), [props.onDismiss]);

    return <>
        <FocusTrap active={props.open} containerElements={[rootElem.current!, collapseElem!]} focusTrapOptions={{
            onDeactivate: onDismiss,
            clickOutsideDeactivates: (e: MouseEvent) => {
                e.preventDefault();
                return true;
            },
        }} />
        <div className={props.classes.root} ref={rootElem}>
            <Backdrop open={props.open} classes={{ root: props.classes.backdrop }} onClick={onDismiss} mountOnEnter unmountOnExit />
            <DivWithSize className={props.classes.target} ref={(e: any) => setTargetElem(findDOMNode(e) as HTMLDivElement)} onSize={({ width }) => {
                setAutocompleteWidth(width ?? undefined);
            }}>
                {props.target}
            </DivWithSize>
            <Popper anchorEl={targetElem} open={props.open} className={props.classes.popover} placement="bottom-start" transition>
                {({ TransitionProps }) => <Collapse className={props.classes.collapse} classes={{
                    wrapperInner: props.classes.collapseInner,
                }} innerRef={(e: any) => setCollapseElem(findDOMNode(e) as HTMLElement)} {...TransitionProps}>
                    <Paper elevation={2} className={props.classes.paper} style={{
                        width: autocompleteWidth,
                        maxHeight: autocompleteMaxHeight,
                    }} onKeyUp={onKeyUp}>
                        {props.children}
                    </Paper>
                </Collapse>
                }
            </Popper>
        </div>
    </>;
}

export default withStyles(styles)(AutocompletePaper);
