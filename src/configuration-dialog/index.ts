import {Component, createElement as __} from "react";
import {Dialog, DialogTitle} from "@material-ui/core";

export type ConfigurationDialog_t = {
    open: boolean,
    onClose: () => void;
};

type State_t = {
    // opened: boolean,
};

export class ConfigurationDialog extends Component<ConfigurationDialog_t, State_t> {
    constructor(props: ConfigurationDialog_t) {
        super(props);
        this.state = {
            opened: props.open,
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
            __(DialogTitle, {}, "Configuration"),
        );
    }
};
