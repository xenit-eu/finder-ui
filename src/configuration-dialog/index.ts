import { addElement } from "@xenit/finder-utils";
import { Component, createElement as __ } from "react";
import Dialog from "../dialog";
import { GeneralSettings_t } from "./content";
import ConfigurationDialogContent from "./content";
import { ManageLayouts_t } from "./manage-layouts";

export type ConfigurationDialog_Props_t = {
    open: boolean,
    onClose: () => void;
    onSave: (generalSettings: GeneralSettings_t, layouts: Array<{ name: string, value: any }>, selectedLayout?: string) => void;
    languages: { [k: string]: string },
    language: string,
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
            open: this.props.open,
            baseClassName: "configuration-dialog",
            dialogTitle: "Settings",
            onClose: this.props.onClose,
            onCancel: this.props.onClose,
            language: this.props.language,
            handleDone: () => this.props.onSave(this.state.generalSettings, this.state.manageLayouts.layouts, this.state.manageLayouts.selectedLayout),
        },
            __(ConfigurationDialogContent,
                {
                    generalSettings: this.state.generalSettings,
                    onChange: (language: string) => {
                        this.setState((state) => (
                            {
                                generalSettings: {
                                    ...state.generalSettings,
                                    language,
                                },
                            }
                        ));
                    },
                    languages: this.props.languages,
                    manageLayouts: {
                        ...this.state.manageLayouts,
                        onChange: (value: string) => {
                            this.setState( (state) => ({
                                manageLayouts: {
                                    ...state.manageLayouts,
                                    selectedLayout: value,
                                },
                            }));
                        },
                        onDelete: (value: string) => {
                            this.setState((state) => ({
                                manageLayouts: {
                                    ...state.manageLayouts,
                                    layouts: state.manageLayouts.layouts.filter(value1 => value1.name !== value),
                                },
                            }));
                        },
                        onSaveCurrentLayout: (value: string) => {
                            let trimVal = value.trim();
                            if (trimVal) {
                                if (this.state.manageLayouts.layouts.findIndex(layout => layout.name === value) === -1) {
                                    this.setState((state) => ({
                                        manageLayouts: {
                                            ...state.manageLayouts,
                                            layouts: addElement(state.manageLayouts.layouts, { name: trimVal, value: state.manageLayouts.currentLayout }),
                                            inputText: "",
                                            selectedLayout: trimVal,
                                        },
                                    }));
                                } else {
                                    alert("A layout with name " + trimVal + " already exists. Remove the existing layout before saving again.");
                                }
                            }
                        },
                    },
                },
            ),
        );
    }
};
