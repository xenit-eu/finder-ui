import React from "react";
import { Input, Paper, Theme, WithStyles, withStyles } from "@material-ui/core";
import { useTranslation } from "react-i18next";

type Searchbar_Props_t = {
    children: React.ReactNode;
    value: string;
    onChange: (value: string) => void;
    onKeyDown?: (event: React.KeyboardEvent) => void,
    editing: boolean;
    actions?: React.ReactNode;
};

const styles = (theme: Theme) => ({
    root: {
        display: "flex" as const,
        alignItems: "center" as const,
    },
    chips: {
        "display": "flex" as const,
        "flexWrap": "wrap" as const,
        "flex": 1,
        "overflow": "auto" as const,
        "max-height" : "6em",
        "&:focus-within": {
              "max-height" : "60em",
        },
        "&:hover": {
              "max-height" : "60em",
        },
        "& > *": {
            marginLeft: theme.spacing.unit / 2,
            marginRight: theme.spacing.unit / 2,
            marginTop: theme.spacing.unit / 4,
            marginBottom: theme.spacing.unit / 4,
        },
    },
    inputField: {
        flex: 1,
        minWidth: 300,
    },
    actions: {
    },

});

function Searchbar(props: Searchbar_Props_t & WithStyles<typeof styles>) {
    const { t } = useTranslation("finder-ui");
    return <Paper elevation={0} className={props.classes.root}>
        <div className={props.classes.chips} >
            {props.children}
            {props.editing && <div className={props.classes.inputField} >
                <Input
                    fullWidth
                    disableUnderline
                    placeholder={(props.children && (props.children.hasOwnProperty("length") ? props.children["length"] > 0 : true)) ? "" : t("searchbar/Searchbar/placeholder")}
                    value={props.value}
                    onChange={(e) => props.onChange(e.target.value)}
                    onKeyDown={props.onKeyDown}
                />
            </div>}
        </div>
        <div className={props.classes.actions}>
            {props.actions ?? <span/>}
        </div>
    </Paper>;
}

export default withStyles(styles)(Searchbar);
