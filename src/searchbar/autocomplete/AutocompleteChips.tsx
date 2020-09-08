import { Theme, WithStyles, withStyles } from "@material-ui/core";
import React, {useEffect, useRef} from "react";

type AutocompleteChips_Props_t = {
    children: React.ReactNode;
};

const styles = (theme: Theme) => ({
    root: {
        display: "flex" as const,
        overflowY: "auto" as const,
    },
    children: {
        "display": "flex" as const,
        "flexDirection": "row" as const,
        [theme.breakpoints.up("sm")]: {
            "& > *:first-child": {
                marginLeft: theme.spacing.unit * 3 / 2,
            },

        },
        "& > *": {
            marginLeft: theme.spacing.unit / 2,
            marginRight: theme.spacing.unit / 2,
        },
        "&:before, &:after": {
            flex: 0,
            content: "' '",
            position: "sticky" as const,
            paddingLeft: theme.spacing.unit,
        },
        "&:before": {
            left: 0,
            backgroundImage: "linear-gradient(90deg, " + theme.palette.background.paper + ", transparent)",
            marginRight: -theme.spacing.unit,
        },
        "&:after": {
            right: 0,
            backgroundImage: "linear-gradient(270deg, " + theme.palette.background.paper + ", transparent)",
        },
    },

});

function AutocompleteChips(props: AutocompleteChips_Props_t & WithStyles<typeof styles>) {
    return <div className={props.classes.root}>
        <div className={props.classes.children}>
            {props.children}
        </div>
    </div>;
}

export default withStyles(styles)(AutocompleteChips);
