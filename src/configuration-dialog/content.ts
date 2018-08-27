import {ChangeEvent, Component, createElement as __} from "react";
import {FormControl, InputLabel, MenuItem, Select, Typography} from "@material-ui/core";
import {Configuration_t} from "./index";

type ConfigurationDialog_Props_t = {
    configuration: Configuration_t,
    onChange: (configuration: Configuration_t) => void,
    languages: { [k: string]: string },
};

export default class ConfigurationDialogContent extends Component<ConfigurationDialog_Props_t> {
    constructor(props: ConfigurationDialog_Props_t) {
        super(props);
    }

    public render() {
        return __(FormControl, {},
            __(Typography, {key: "language-title", variant: "subheading"}, "Choose your language"),
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
        );
    }
};
