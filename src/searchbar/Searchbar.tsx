import { Input, Paper, Theme, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
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
        <div className={props.classes.chips}>
            {props.children}
            {props.editing && <div className={props.classes.inputField}>
                <Input
                    fullWidth
                    disableUnderline
                    placeholder={t("searchbar/Searchbar/placeholder")}
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
