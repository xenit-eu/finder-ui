import { IconButton, SnackbarContent } from "@material-ui/core";
import type { SvgIcon } from "@material-ui/core";
import { amber, green } from "@material-ui/core/colors";
import { Theme, WithStyles, withStyles } from "@material-ui/core/styles";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CloseIcon from "@material-ui/icons/Close";
import DeveloperBoardIcon from "@material-ui/icons/DeveloperBoard";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import WarningIcon from "@material-ui/icons/Warning";
import classnames from "classnames";
import * as React from "react";
import { useTranslation } from "react-i18next";
import useUuid from "../util/hooks/useUuid";

export type SnackbarNotification_Variant_t = "info" | "success" | "warning" | "error";

type SnackbarNotification_Props_t = {
    variant: SnackbarNotification_Variant_t,
    message: string,
    onTrace?: () => void,
    onClose: () => void,
} & WithStyles<typeof styles>;

const styles = (theme: Theme) => ({
    info: {
        backgroundColor: theme.palette.primary.dark,
    },
    success: {
        backgroundColor: green[600],
    },
    warning: {
        backgroundColor: amber[700],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    icon: {
        fontSize: 20,
    },
    messageIcon: {
        opacity: 0.9,
        marginRight: theme.spacing.unit,
    },
    message: {
        display: "flex",
        alignItems: "center",
    },
});

const variantIcon: { [variant in SnackbarNotification_Variant_t]: typeof SvgIcon } = {
    info: InfoIcon,
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
};

function SnackbarNotification(props: SnackbarNotification_Props_t) {
    const messageId = useUuid("snackbar-SnackbarNotification-");
    const Icon = variantIcon[props.variant];
    const { t } = useTranslation("finder-ui");
    return <SnackbarContent
        className={props.classes[props.variant]}
        aria-describedby={messageId}
        message={
            <span id={messageId} className={props.classes.message}>
                <Icon className={classnames(props.classes.icon, props.classes.messageIcon)} role="presentation" />
                {props.message}
            </span>
        }
        action={<>
            {props.onTrace && <IconButton
                aria-label={t("snackbar/SnackbarNotification/trace")}
                color="inherit"
                onClick={() => props.onTrace!()}
            >
                <DeveloperBoardIcon className={props.classes.icon} />
            </IconButton>
            }
            <IconButton
                aria-label={t("snackbar/SnackbarNotification/close")}
                color="inherit"
                onClick={() => props.onClose()}
            >
                <CloseIcon className={props.classes.icon} />
            </IconButton>
        </>
        }
    />;
}

export default withStyles(styles)(SnackbarNotification);
