import {Component, createElement as __} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Theme, Typography, withStyles, WithStyles} from "@material-ui/core";

type DialogProps_t = {
    open: boolean,
    baseClassName: string,
    dialogTitle: string,
    onClose: () => void,
    onCancel: () => void,
    handleDone: () => void,
} & WithStyles<"dialogTitle" | "dialogTitleText" | "subheading">;

/* @internal */
export class FinderDialog extends Component<DialogProps_t> {

    public render() {
        return __(Dialog, {
            key: "dialog",
            open: this.props.open,
            className: this.props.baseClassName,
            scroll: "paper",
            fullWidth: true,
            onClose: this.props.onClose,
        }, __(DialogTitle, {
                className: this.props.classes!.dialogTitle,
                disableTypography: true,
            }, __(Typography, { className: this.props.classes!.dialogTitleText, variant: "title" }, this.props.dialogTitle)),
            __(DialogContent, { className: this.props.baseClassName + "-content", children: this.props.children},
            ),
            __(DialogActions, { className: "actions-container" },
                __(Button, {
                    onClick: this.props.onCancel,
                    className: this.props.baseClassName + "-cancel-button",
                }, "Cancel"),
                __(Button, {
                    variant: "contained",
                    color: "primary",
                    className: this.props.baseClassName + "-done-button",
                    onClick: this.props.handleDone,
                }, "Done"),
            ),
        );
    }

};

export default withStyles((theme: Theme) => ({
    dialogTitle: {
        backgroundColor: theme.palette.primary.main,
    },
    dialogTitleText: {
        color: theme.palette.primary.contrastText,
    },
    subheading: {
        marginTop: theme.spacing.unit,
    },
}), { name: "Dialog" })(FinderDialog);
