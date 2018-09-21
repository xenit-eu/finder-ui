import {Component, createElement as __} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import {GeneralSettings_t} from "./content";
import ConfigurationDialogContent from "./content";
import {ManageLayouts_t} from "./manage-layouts";
import {addElement} from "finder-utils";

export type ConfigurationDialog_Props_t = {
    open: boolean,
    onClose: () => void;
    onSave: (generalSettings: GeneralSettings_t, layouts: Array<{name: string, value: any}>, selectedLayout?: string) => void;
    languages: {[k: string]: string},
} & State_t;

type State_t = {
    generalSettings: GeneralSettings_t,
    manageLayouts: ManageLayouts_t,
};

export class ConfigurationDialog extends Component<ConfigurationDialog_Props_t, State_t> {
    constructor(props: ConfigurationDialog_Props_t) {
        super(props);
        this.state = {
            generalSettings: props.generalSettings,
            manageLayouts: props.manageLayouts,
        };
    }

    public render() {
        return __(Dialog, {
                key: "dialog",
                open: this.props.open,
                className: "settings-dialog",
                scroll: "paper",
                fullWidth: true,
                onClose: this.props.onClose,
            },
            __(DialogTitle, {key: "title"}, "Settings"),
            __(DialogContent, {key: "content", className: "generalSettings-dialog-content"},
                __(ConfigurationDialogContent,
                    {
                        generalSettings: this.state.generalSettings,
                        onChange: (conf: GeneralSettings_t) => {
                            this.setState({
                              generalSettings: conf,
                            });
                        },
                        languages: this.props.languages,
                        manageLayouts: {
                            ...this.state.manageLayouts,
                            onChange: (value: string) => {
                                this.setState({
                                    ...this.state,
                                    manageLayouts: {
                                        ...this.state.manageLayouts,
                                        selectedLayout: value,
                                    },
                                });
                            },
                            onDelete: (value: string) => {
                                this.setState( {
                                    ...this.state,
                                    manageLayouts: {
                                        ...this.state.manageLayouts,
                                        layouts: this.state.manageLayouts.layouts.filter(value1 => value1.name !== value),
                                    },
                                });
                            },
                            onSaveCurrentLayout: (value: string) => {
                                let trimVal = value.trim();
                                if (trimVal) {
                                    if (this.state.manageLayouts.layouts.findIndex(layout => layout.name === value ) === -1) {
                                        this.setState({
                                            ...this.state,
                                            manageLayouts: {
                                                ...this.state.manageLayouts,
                                                layouts: addElement(this.state.manageLayouts.layouts, { name: trimVal, value: this.state.manageLayouts.currentLayout}),
                                                inputText: "",
                                                selectedLayout: trimVal,
                                            },
                                        });
                                    } else {
                                        alert("A layout with name " + trimVal + " already exists. Remove the existing layout before saving again.");
                                    }
                                }
                            },
                        },
                    },
                ),
            ),
            __(DialogActions, {className: "actions-container"},
                __(Button, {
                    onClick: this.props.onClose,
                    className: "generalSettings-dialog-cancel-button",
                }, "Cancel"),
                __(Button, {
                    variant: "contained",
                    color: "primary",
                    onClick: () => this.props.onSave(this.state.generalSettings, this.state.manageLayouts.layouts, this.state.manageLayouts.selectedLayout),
                    className: "configuration-dialog-done-button",
                }, "Done"),
            ),
        );
    }
};
