import { Theme, WithStyles, withStyles } from "@material-ui/core";
import Chip, { ChipProps } from "@material-ui/core/Chip";
import React, { ReactInstance, useLayoutEffect, useRef } from "react";
import { findDOMNode } from "react-dom";
import { SizeMe, SizeMeProps } from "react-sizeme";
import useUuid from "../../util/hooks/useUuid";

const chipDefaultHeight = 32;

const styles = (theme: Theme) => ({
    root: {
        height: "unset",
        minHeight: chipDefaultHeight,
    },

});

function ResizableChip(props: ChipProps & WithStyles<typeof styles>) {
    const cssVariable = useUuid("--ResizableChip-height-");
    const chipRef = useRef<ReactInstance>();
    useLayoutEffect(() => {
        if (chipRef.current) {
            const domElement = findDOMNode(chipRef.current) as HTMLElement;
            // Element may be hidden by display:none while Suspense is in effect.
            // We don't want a height of 0 to be calculated in that case,
            domElement.style.setProperty(cssVariable, (domElement.clientHeight || chipDefaultHeight) + "px");
        }
    });
    return <SizeMe
        monitorHeight={true}
        monitorWidth={false}
        noPlaceholder={true}
    >{({ size: { height } }: SizeMeProps) => <Chip {...props} innerRef={chipRef} style={{
        // We avoid setting the cssVariable when the height is not yet known
        // In that case, the cssVariable set by the above useLayoutEffect will be used
        // This avoid having a flash of a rectangular chip before SizeMe has calculated the correct size of the element
        // We could set noPlaceholder to false to avoid this flash, but then there would be a flash of a missing element while the size is being calculated
        [cssVariable + (height ? "" : "X")]: height + "px",
        borderRadius: "calc(var(" + cssVariable + ") / 2)",
        paddingLeft: "calc(var(" + cssVariable + ") * (12 / 32) - 12px)",
        paddingRight: "calc(var(" + cssVariable + ") * (12 / 32) - 12px)",
    }} />

        }
    </SizeMe>;
}

export default withStyles(styles)(ResizableChip);
