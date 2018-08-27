import {Component, createElement as __} from "react";
import {Button, Dialog, DialogActions, DialogTitle} from "@material-ui/core";
import DialogContent from "@material-ui/core/es/DialogContent/DialogContent";
import ConfigurationDialogContent from "./content";

export type ConfigurationDialog_t = {
    open: boolean,
    onClose: () => void;
    onSave: (configuration: Configuration_t) => void;
    configuration: Configuration_t,
    languages: {[k: string]: string},
};

export type Configuration_t = {
    language: string,
};

type State_t = {
    configuration: Configuration_t,
};

export class ConfigurationDialog extends Component<ConfigurationDialog_t, State_t> {
    constructor(props: ConfigurationDialog_t) {
        super(props);
        this.state = {
            configuration: props.configuration,
        };
    }

    public render() {
        return __(Dialog, {
                key: "dialog",
                open: this.props.open,
                className: "configuration-dialog",
                scroll: "paper",
                fullWidth: true,
                onClose: this.props.onClose,
            },
            __(DialogTitle, {key: "title"}, "Configuration"),
            __(DialogContent, {key: "content", className: "configuration-dialog-content"},
                __(ConfigurationDialogContent,
                    {
                        configuration: this.state.configuration,
                        onChange: (conf: Configuration_t) => {
                            this.setState({
                              configuration: conf,
                            });
                        },
                        languages: this.props.languages,
                    },
                ),
            ),
            __(DialogActions, {className: "actions-container"},
                __(Button, {
                    onClick: this.props.onClose,
                }, "Cancel"),
                __(Button, {
                    variant: "contained",
                    color: "primary",
                    onClick: () => this.props.onSave(this.state.configuration),
                }, "Done"),
            ),
        );
    }
};
