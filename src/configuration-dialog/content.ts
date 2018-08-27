import {ChangeEvent, Component, ComponentType, createElement as __, Fragment} from "react";
import * as _ from "react-dom-factories";
import {
    Button,
    FormControl, IconButton, Input,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    WithStyles,
    withStyles,
} from "@material-ui/core";
import {Configuration_t} from "./index";
import ConfigurationExpansionPanel from "./configuration-expansion-panel";
import AddCircle from "@material-ui/icons/AddCircle";

type ConfigurationDialog_Props_t = {
    configuration: Configuration_t,
    onChange: (configuration: Configuration_t) => void,
    languages: { [k: string]: string },
} & WithStyles<"flex" | "formControl">;

class ConfigurationDialogContent extends Component<ConfigurationDialog_Props_t> {
    constructor(props: ConfigurationDialog_Props_t) {
        super(props);
    }

    public render() {
        return __(Fragment, {},
            __(ConfigurationExpansionPanel, {title: "General Settings"},
                _.div({className: this.props.classes.flex},
                    __(FormControl, {className: this.props.classes.formControl},
                        __(InputLabel, {key: "language-title", htmlFor: "lang"}, "Choose your language"),
                        __(Select,
                            {
                                value: this.props.configuration.language,
                                inputProps: {
                                    name: "lang",
                                    id: "lang",
                                },
                                onChange: (event1: ChangeEvent<HTMLSelectElement>) => this.props.onChange({
                                    ...this.props.configuration,
                                    language: event1.target.value,
                                }),

                            },
                            Object.keys(this.props.languages).map((langCode) => __(MenuItem, {key: langCode, value: langCode}, this.props.languages[langCode])),
                        ),
                    ),
                ),
            ),
            __(ConfigurationExpansionPanel, {title: "Manage Layouts"},
                _.div({className: this.props.classes.flex},
                    __(FormControl, {className: this.props.classes.formControl},
                        __(InputLabel, {htmlFor: "save-layout-input"}, "Save current layout"),
                        __(Input, {
                                inputProps: {
                                    name: "save-layout-input",
                                    id: "save-layout-input",
                                },
                            },
                        ),
                    ),
                    __(IconButton, {}, __(AddCircle, {})),
                ),
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
    flex: {
        display: "flex",
        width: "100%",
    },
}))(comp);
