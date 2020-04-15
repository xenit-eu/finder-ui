import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { Theme, withStyles, WithStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import ListIcon from "@material-ui/icons/List";
import RestoreIcon from "@material-ui/icons/Restore";
import classnames from "classnames";
import React from "react";
import { useTranslation } from "react-i18next";
import OverflowMenu, { IOverflowMenuItem } from "../menu/OverflowMenu";

export interface IVersion {
    versionNumber: string;
    versionDate: Date;
    title: string;
    comment: string;
    author: string;
};

type Version_Props_t = {
    version: IVersion,
    active: boolean,
    onDownload?: () => void,
    onDetails?: () => void,
    onRevert?: () => void,
} & WithStyles<typeof styles>;

const styles = (theme: Theme) => ({
    root: {
        padding: theme.spacing.unit,
    },
    versionNumberLabel: {
        backgroundColor: theme.palette.grey[400],
        color: theme.palette.getContrastText(theme.palette.grey[400]),
        padding: theme.spacing.unit / 2,
        borderRadius: theme.shape.borderRadius,
    },
    versionNumberLabelActive: {
        backgroundColor: theme.palette.secondary.dark,
        color: theme.palette.getContrastText(theme.palette.secondary.dark),
    },
    versionDescription: {
        flexGrow: 1,
    },

});

function Version(props: Version_Props_t) {
    const { t } = useTranslation("finder-ui");
    return <Paper className={props.classes.root}>
        <Grid container direction="row" spacing={16}>
            <Grid item>
                <Typography variant="button" color="inherit" className={classnames(
                    props.classes.versionNumberLabel,
                    {
                        [props.classes.versionNumberLabelActive]: props.active,
                    },

                )}>{props.version.versionNumber}</Typography>
            </Grid>
            <Grid item className={props.classes.versionDescription}>
                <Typography variant="subheading" gutterBottom>{props.version.title}</Typography>
                <Typography variant="caption" gutterBottom>{props.version.author} &bull; {t("versions/Version/date", { date: props.version.versionDate })}</Typography>
                <Typography>{props.version.comment}</Typography>
            </Grid>
            <Grid item>
                <VersionMenu {...props} />
            </Grid>
        </Grid>
    </Paper>;
}

export default withStyles(styles, { name: "FinderVersion" })(Version);

function VersionMenu(props: Version_Props_t) {
    const { t } = useTranslation("finder-ui");
    const actions: IOverflowMenuItem[] = [];
    if (props.onDownload) {
        actions.push({
            label: t("versions/Version/download"),
            icon: <CloudDownloadIcon />,
            onClick: props.onDownload,
        });
    }

    if (props.onDetails) {
        actions.push({
            label: t("versions/Version/details"),
            icon: <ListIcon />,
            onClick: props.onDetails,
        });
    }

    if (props.onRevert) {
        actions.push({
            label: t("versions/Version/revert"),
            icon: <RestoreIcon />,
            onClick: props.onRevert,
        });
    }

    return <OverflowMenu
        items={actions}
        maxItems={2}
    />;
}
