import { Theme, WithStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";

type IconWithText_Props_t = {
    icon: React.ReactNode,
    text: string,
};

const styles = (theme: Theme) => ({
    root: {
        display: "flex",
        alignItems: "center",
    },
    text: {
        marginLeft: theme.spacing.unit,
    },

});

function IconWithText(props: IconWithText_Props_t & WithStyles<typeof styles>) {
    return <Typography color="inherit" className={props.classes.root}>
        {props.icon}
        <span className={props.classes.text}>{props.text}</span>
    </Typography>;
}

export default withStyles(styles)(IconWithText);
