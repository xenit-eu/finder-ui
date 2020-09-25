import { Theme, withStyles, WithStyles } from "@material-ui/core/styles";
import { emphasize, fade } from "@material-ui/core/styles/colorManipulator";
import React, { ReactNode } from "react";
import StopPropagation from "../../util/StopPropagation";
import ResizableChip from "./ResizableChip";

type CompositeChip_Props_t = {
    onDelete?: () => void,
    children: readonly ReactNode[],
};

const compositeChipStyle = (theme: Theme) => {
    const mainColor = fade(theme.palette.common.black, 0.22);
    return {
        root: {
            "backgroundColor": mainColor,
            "&:hover, &:focus": {
                backgroundColor: emphasize(mainColor, 0.08),
            },
            "&:active": {
                backgroundColor: emphasize(mainColor, 0.12),
            },
        },
        label: {
            paddingTop: theme.spacing.unit / 2,
            paddingBottom: theme.spacing.unit / 2,
        },
    };
};

function CompositeChip(props: CompositeChip_Props_t & WithStyles<typeof compositeChipStyle>) {
    return <ResizableChip
        className={props.classes.root}
        onDelete={props.onDelete ? () => props.onDelete!() : undefined}
        label={<CompositeChipLabel {...props} />}
    />;
}

export default withStyles(compositeChipStyle)(CompositeChip);

function CompositeChipLabel(props: CompositeChip_Props_t & WithStyles<typeof compositeChipStyle>) {
    return <StopPropagation>
        <div className={props.classes.label}>
            {React.Children.map(props.children, (child, i) => <>{i > 0 ? " " : ""}{child}</>)}
        </div>
    </StopPropagation>;
}
