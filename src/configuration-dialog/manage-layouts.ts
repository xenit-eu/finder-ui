import {Button, FormControl, IconButton, Input, InputLabel, List, ListItem, ListItemSecondaryAction, ListItemText, Radio, WithStyles} from "@material-ui/core";
import {KeyboardEvent, ChangeEvent, Component, ComponentType, createElement as __, Fragment} from "react";
import FullWidthFlexContainer from "./full-width-flexcontainer";
import AddCircle from "@material-ui/icons/AddCircle";
import Delete from "@material-ui/icons/Delete";
import { withStyles } from "@material-ui/core";

export type ManageLayouts_t = {
    currentLayout?: string,
    layoutNames: string[],
    inputText?: string,
};

export type ManageLayouts_Callbacks_t = {
    onChange: (value: string) => void,
    onDelete: (value: string) => void,
    onSaveCurrentLayout: (value: string) => void,
};

type ManageLayouts_Props_t =
ManageLayouts_Callbacks_t
& ManageLayouts_t
& WithStyles<"rightIcon" | "formControl">;

class ManageLayouts extends Component<ManageLayouts_Props_t, {input: string}> {

    public render() {
        return __(Fragment, {},
            __(FullWidthFlexContainer, {},
                __(FormControl, {className: this.props.classes.formControl},
                    __(InputLabel, {htmlFor: "save-layout-input"}, "Save current layout"),
                    __(Input, {
                            inputProps: {
                                name: "save-layout-input",
                                id: "save-layout-input",
                            },
                            onChange: (event1: ChangeEvent<HTMLInputElement>) => {
                                this.setState({
                                   input: event1.target.value,
                                });
                            },
                            onKeyUp: (event1: KeyboardEvent<HTMLInputElement>) => {
                                if(event1.key === "Enter") {
                                    this.props.onSaveCurrentLayout(this.state.input);
                                }
                            },
                        },
                    ),
                ),
                __(IconButton, {}, __(AddCircle, {onClick: () => this.props.onSaveCurrentLayout(this.state.input)})),
            ),
            __(List, {},
                this.props.layoutNames.map((value, index) => {
                    return __(ListItem, {key: "layout" + index, button: true, onClick: () => this.props.onChange(value)},
                        __(Radio, {checked: value === this.props.currentLayout}),
                        __(ListItemText, { primary: value }),
                        __(ListItemSecondaryAction, {},
                            __(Button, {color: "secondary", variant: "contained", className: this.props.classes.rightIcon, onClick: () => this.props.onDelete(value)}, "DELETE", __(Delete, {})),
                        ),
                    );
                }),
            ),
        );
    }
}

const comp: ComponentType<ManageLayouts_Props_t> = ManageLayouts;

export default withStyles( theme => ({
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    formControl: {
        flexGrow: 1,
        flexBase: "0%",
    },
}))(comp);
