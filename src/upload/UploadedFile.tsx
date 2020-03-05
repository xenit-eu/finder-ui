import { CircularProgress, Grid, IconButton } from "@material-ui/core";
import { Theme, WithStyles, withStyles } from "@material-ui/core/styles";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import Cancel from "@material-ui/icons/Cancel";
import CheckCircle from "@material-ui/icons/CheckCircle";
import classNames from "classnames";
import * as React from "react";
import { useTranslation } from "react-i18next";

const styles = (theme: Theme) => ({
    root: {
        height: 48 + 2 * theme.spacing.unit,
        alignItems: "center",
    },
    uploading: {

    },
    uploaded: {

    },
    cancelable: {

    },
    clickable: {
        "cursor": "pointer",
        "&:hover": {
            backgroundColor: theme.palette.action.hover,
        },
    },

    uploadedIcon: {

    },

    uploadProgress: {
        "display": "flex",
        "alignContent": "center",
        "width": 48,
        "& > *": {
            margin: "auto",
        },
    },

    uploadTitle: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    } as CSSProperties,
    uploadCancel: {

    },
});

type UploadedFile_Props_t = {
    name: string,
    progress: number,
    onCancel?: () => void,
    onClick?: () => void,
    actions?: React.ReactNode,
} & WithStyles<typeof styles>;

function UploadedFileInternal(props: UploadedFile_Props_t) {
    const progress = Math.min(1, Math.max(0, props.progress));
    const isCompleted = progress >= 1;
    const { t } = useTranslation("finder-ui");
    return <Grid className={classNames(props.classes.root, {
        [props.classes.uploading]: !isCompleted,
        [props.classes.uploaded]: isCompleted,
        [props.classes.cancelable]: !!props.onCancel && !isCompleted,
        [props.classes.clickable]: !!props.onClick,
    })} container onClick={() => props.onClick && props.onClick()}>
        <Grid item className={props.classes.uploadProgress}>
            {isCompleted ? <CheckCircle className={props.classes.uploadedIcon} aria-label={t("upload/UploadedFile/done")} /> : <CircularProgress size={24} variant="static" value={progress * 100} />}
        </Grid>
        <Grid item xs className={props.classes.uploadTitle}>{props.name}</Grid>
        {props.onCancel && !isCompleted ? <Grid item className={props.classes.uploadCancel}>
            <IconButton onClick={(e) => {
                e.stopPropagation();
                props.onCancel!();
            }} role="button" title={t("upload/UploadedFile/cancel")}>
                <Cancel />
            </IconButton>
        </Grid> : props.actions}
    </Grid>;
}

export default withStyles(styles, { name: "FinderUploadedFile" })(UploadedFileInternal);
