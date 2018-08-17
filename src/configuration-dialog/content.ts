import {ChangeEvent, Component, ComponentType, createElement as __, Fragment} from "react";
import {ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, FormControl, InputLabel, MenuItem, Select, StyledComponentProps, Typography, withStyles} from "@material-ui/core";
import {Configuration_t} from "./index";

type ConfigurationDialog_Props_t = {
    configuration: Configuration_t,
    onChange: (configuration: Configuration_t) => void,
    languages: { [k: string]: string },
} & StyledComponentProps<"expansionPanelDetails" | "formControl">;

class ConfigurationDialogContent extends Component<ConfigurationDialog_Props_t> {
    constructor(props: ConfigurationDialog_Props_t) {
        super(props);
    }

    public render() {
        return __(Fragment, {},
            __(ExpansionPanel, {defaultExpanded: true},
                __(ExpansionPanelSummary, {},
                    __(Typography, {}, "General Settings"),
                ),
                __(ExpansionPanelDetails, {className: this.props.classes.expansionPanelDetails},
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
                            Object.keys(this.props.languages).map( (langCode) => __(MenuItem, { key: langCode, value: langCode }, this.props.languages[langCode])),
                        ),
                    ),
                ),
            ),
            __(Typography, {key: "layouts-title", variant: "title"}, "Manage layouts"),
        );
    }
};

const comp: ComponentType<ConfigurationDialog_Props_t> = ConfigurationDialogContent;

export default withStyles(theme => ({
    expansionPanelDetails: {
        display: "flex",
    },
    formControl: {
        width: "100%",
    },
}))(comp);
