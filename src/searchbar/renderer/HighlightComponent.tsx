import { Theme, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
type HighlightComponent_Props_t = {
    children: React.ReactNode;
};

const styles = (theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.secondary.light,
        color: theme.palette.secondary.contrastText,
    },
});

function HighlightComponent(props: HighlightComponent_Props_t & WithStyles<typeof styles>) {
    return <mark className={props.classes.root}>{props.children}</mark>;
}

export default withStyles(styles, { name: "FinderUIAutocompleteHighlight" })(HighlightComponent);
