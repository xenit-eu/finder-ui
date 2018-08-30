import {ChangeEvent, Component, ComponentType, createElement as __, Fragment} from "react";
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    WithStyles,
    withStyles,
} from "@material-ui/core";
import ConfigurationExpansionPanel from "./configuration-expansion-panel";
import FullWidthFlexContainer from "./full-width-flexcontainer";
import ManageLayouts, {ManageLayouts_Callbacks_t, ManageLayouts_t} from "./manage-layouts";

export type GeneralSettings_t = {
    language: string,
};

type ConfigurationDialog_Props_t = {
    generalSettings: GeneralSettings_t,
    manageLayouts: ManageLayouts_t & ManageLayouts_Callbacks_t,
    onChange: (generalSettings: GeneralSettings_t) => void,
    languages: { [k: string]: string },
} & WithStyles<"formControl">;

class ConfigurationDialogContent extends Component<ConfigurationDialog_Props_t> {
    constructor(props: ConfigurationDialog_Props_t) {
        super(props);
    }

    public render() {
        return __(Fragment, {},
            __(ConfigurationExpansionPanel, {title: "General Settings"},
                __(FullWidthFlexContainer, {},
                    __(FormControl, {className: this.props.classes.formControl},
                        __(InputLabel, {key: "language-title", htmlFor: "lang"}, "Choose your language"),
                        __(Select,
                            {
                                value: this.props.generalSettings.language,
                                inputProps: {
                                    name: "lang",
                                    id: "lang",
                                },
                                onChange: (event1: ChangeEvent<HTMLSelectElement>) => this.props.onChange({
                                    ...this.props.generalSettings,
                                    language: event1.target.value,
                                }),

                            },
                            Object.keys(this.props.languages).map((langCode) => __(MenuItem, {key: langCode, value: langCode}, this.props.languages[langCode])),
                        ),
                    ),
                ),
            ),
            __(ConfigurationExpansionPanel, {title: "Manage Layouts"},
                __(ManageLayouts, {...this.props.manageLayouts}),
            ),
        );
    }
};

const comp: ComponentType<ConfigurationDialog_Props_t> = ConfigurationDialogContent;

export default withStyles(theme => ({
    formControl: {
        flexGrow: 1,
        flexBase: "0%",
    },
}))(comp);
