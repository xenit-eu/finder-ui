import ButtonBase from "@material-ui/core/ButtonBase";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { Theme, withStyles, WithStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import ListIcon from "@material-ui/icons/List";
import RestoreIcon from "@material-ui/icons/Restore";
import classnames from "classnames";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import OverflowMenu, { IOverflowMenuItem } from "../menu/OverflowMenu";
import useDelayedProp from "../util/hooks/useDelayedProp";
import StopPropagation from "../util/StopPropagation";

export interface IVersion {
    readonly versionNumber: string;
    readonly versionDate: Date;
    readonly title: string;
    readonly comment: string;
    readonly author: string;
};

type Version_Props_t = {
    version: IVersion,
    latest?: boolean,
    selected?: boolean,
    onClick?: () => void,
    onDownload?: () => void,
    onDetails?: () => void,
    onRevert?: () => void,
} & WithStyles<typeof styles>;

const styles = (theme: Theme) => ({
    root: {
        overflow: "hidden",
    },
    rootSelected: {
        backgroundColor: theme.palette.action.selected,
    },
    button: {
        padding: theme.spacing.unit,
        width: "100%",
        textAlign: "initial" as "initial",
    },
    versionNumberLabel: {
        backgroundColor: theme.palette.grey[400],
        color: theme.palette.getContrastText(theme.palette.grey[400]),
        padding: theme.spacing.unit / 2,
        borderRadius: theme.shape.borderRadius,
    },
    versionNumberLabelLatest: {
        backgroundColor: theme.palette.secondary.dark,
        color: theme.palette.getContrastText(theme.palette.secondary.dark),
    },
    versionDescription: {
        flexGrow: 1,
    },
    versionCommentEmpty: {
        color: theme.palette.text.disabled,
    },

});

function Version(props: Version_Props_t) {
    const { t } = useTranslation("finder-ui");
    const selected = useDelayedProp(props.selected, 550, (s) => !s); // Wait until touch ripple has finished
    return <Paper className={classnames(
        props.classes.root,
        {
            [props.classes.rootSelected]: props.selected,
        },
    )}>
        <ButtonBase disabled={selected || !props.onClick} className={props.classes.button} onClick={props.onClick ? () => props.onClick!() : undefined}>
            <Grid container direction="row" spacing={16}>
                <Grid item>
                    <Typography variant="button" color="inherit" className={classnames(
                        props.classes.versionNumberLabel,
                        {
                            [props.classes.versionNumberLabelLatest]: props.latest,
                        },

                    )}>{props.version.versionNumber}</Typography>
                </Grid>
                <Grid item className={props.classes.versionDescription}>
                    <Typography variant="subheading" gutterBottom>{props.version.title}</Typography>
                    <Typography variant="caption" gutterBottom>{props.version.author} &bull; {t("versions/Version/date", { date: props.version.versionDate })}</Typography>
                    {props.version.comment.length > 0 ?
                        <Typography>{props.version.comment}</Typography> :
                        <Typography className={props.classes.versionCommentEmpty}>{t("versions/Version/no-comment")}</Typography>
                    }
                </Grid>
                <Grid item>
                    <StopPropagation>
                        <div>
                            <VersionMenu {...props} />
                        </div>
                    </StopPropagation>
                </Grid>
            </Grid>
        </ButtonBase>
    </Paper>;
}

export default withStyles(styles, { name: "FinderVersion" })(React.memo(Version));

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
