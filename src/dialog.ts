import { Component, createElement as __ } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Theme, Typography, withStyles, WithStyles } from "@material-ui/core";
import { ENGLISH, FRENCH, DUTCH, WordTranslator, TranslationsChecked, SPANISH } from "./WordTranslator";
import { ISynchronousTranslationService } from "./search";

const CANCEL = "Cancel";
const DONE = "Done";

const translations: TranslationsChecked = {
    [ENGLISH]: {
        [CANCEL]: CANCEL,
        [DONE]: DONE,
    },
    [FRENCH]: {
        [CANCEL]: "Annuler",
        [DONE]: "OK",
    },
    [DUTCH]: {
        [CANCEL]: "Annuleren",
        [DONE]: "OK",
    },
    [SPANISH]: {
        [CANCEL]: "Cancelar",
        [DONE]: "Hecho",
    },
};

type DialogProps_t = {
    open: boolean,
    baseClassName: string,
    dialogTitle: string,
    onClose: () => void,
    onCancel: () => void,
    handleDone: () => void,
    language: string,
} & WithStyles<"dialogTitle" | "dialogTitleText" | "subheading">;

/* @internal */
export class FinderDialog extends Component<DialogProps_t> {
    private translate: WordTranslator;

    constructor(props: DialogProps_t) {
        super(props);
        this.translate = new WordTranslator(() => this.props.language, translations);
    }

    public render() {
        return __(Dialog, {
            open: this.props.open,
            className: this.props.baseClassName,
            scroll: "paper",
            fullWidth: true,
            onClose: this.props.onClose,
        }, __(DialogTitle, {
            className: this.props.classes!.dialogTitle,
            disableTypography: true,
        }, __(Typography, { className: this.props.classes!.dialogTitleText, variant: "title" }, this.props.dialogTitle)),
            __(DialogContent, { className: this.props.baseClassName + "-content", children: this.props.children },
            ),
            __(DialogActions, { className: "actions-container" },
                __(Button, {
                    onClick: this.props.onCancel,
                    className: this.props.baseClassName + "-cancel-button",
                }, this.translate.translateWord(CANCEL)),
                __(Button, {
                    variant: "contained",
                    color: "primary",
                    className: this.props.baseClassName + "-done-button",
                    onClick: this.props.handleDone,
                }, this.translate.translateWord(DONE)),
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
