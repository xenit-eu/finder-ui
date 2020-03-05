import {Button, FormControl, IconButton, Input, InputLabel, List, ListItem, ListItemSecondaryAction, ListItemText, Radio, WithStyles} from "@material-ui/core";
import {withStyles} from "@material-ui/core";
import AddCircle from "@material-ui/icons/AddCircle";
import Delete from "@material-ui/icons/Delete";
import {ChangeEvent, Component, ComponentType, createElement as __, Fragment, KeyboardEvent} from "react";
import FullWidthFlexContainer from "./full-width-flexcontainer";

export type ManageLayouts_t = {
    selectedLayout?: string,
    currentLayout: any,
    layouts: Array<{
        name: string,
        value: any,
    }>,
    inputText?: string,
};

export type ManageLayouts_Callbacks_t = {
    onChange: (name: string) => void,
    onDelete: (name: string) => void,
    onSaveCurrentLayout: (value: string) => void,
};

type ManageLayouts_Props_t =
    ManageLayouts_Callbacks_t
    & ManageLayouts_t
    & WithStyles<"rightIcon" | "formControl">;

class ManageLayouts extends Component<ManageLayouts_Props_t, { input: string }> {
    constructor(props: ManageLayouts_Props_t) {
        super(props);
        this.state = {
            input: "",
        };
    }

    private saveCurrentLayout() {
        this.props.onSaveCurrentLayout(this.state.input);
        this.setState({
                input: "",
            },
        );
    }

    public render() {
        return __(Fragment, {},
            __(FullWidthFlexContainer, {},
                __(FormControl, {className: this.props.classes.formControl},
                    __(InputLabel, {htmlFor: "save-layout-input"}, "Save current layout"),
                    __(Input, {
                            value: this.state.input,
                            inputProps: {
                                name: "save-layout-input",
                                id: "save-layout-input",
                            },
                            className: "manage-layouts-input",
                            onChange: (event1: ChangeEvent<HTMLInputElement>) => {
                                this.setState({
                                    input: event1.target.value,
                                });
                            },
                            onKeyUp: (event1: KeyboardEvent<HTMLInputElement>) => {
                                if (event1.key === "Enter") {
                                    this.saveCurrentLayout();
                                }
                            },
                        },
                    ),
                ),
                __(IconButton, {}, __(AddCircle, {
                    onClick: () => {
                        this.saveCurrentLayout();
                    },
                    className: "save-current-layout",
                })),
            ),
            __(List, {},
                this.props.layouts.map((value, index) => {
                    return __(ListItem, {key: "layout" + index, button: true, onClick: () => this.props.onChange(value.name), className: "layout-item-" + value.name },
                        __(Radio, {checked: value.name === this.props.selectedLayout}),
                        __(ListItemText, {primary: value.name}),
                        __(ListItemSecondaryAction, {},
                            __(Button, {color: "secondary", variant: "contained", className: this.props.classes.rightIcon, onClick: () => this.props.onDelete(value.name)}, "DELETE", __(Delete, {})),
                        ),
                    );
                }),
            ),
        );
    }
}

const comp: ComponentType<ManageLayouts_Props_t> = ManageLayouts;

export default withStyles((theme) => ({
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    formControl: {
        flexGrow: 1,
        flexBase: "0%",
    },
}))(comp);
