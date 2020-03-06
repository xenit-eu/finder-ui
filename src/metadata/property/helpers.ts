import { TextField, TextFieldProps } from "material-ui";
import { Component, ComponentClass, ComponentType, createElement as __, FormEvent } from "react";

type ChangeOnBlurField_State_t =  {
    value?: string | number,
};

export class ChangeOnBlurTextField extends Component<TextFieldProps, ChangeOnBlurField_State_t> {
    constructor(props: TextFieldProps) {
        super(props);
        this.state = {
            value: props.value,
        };
    }

    public componentWillReceiveProps(nextProps: TextFieldProps) {
        if (nextProps.value !== this.state.value) {
            this.setState({ value: nextProps.value });
        }
    }

    public render() {
        return __(TextField, {
            ...<any> this.props,
            value: this.state.value,
            onChange: (evt: FormEvent<{}>, value: string) => {
                this.setState({ value });
            },
            onBlur: (evt: any) => {
                if (this.props.onChange && this.state.value !== undefined && this.state.value !== this.props.value) {
                    this.props.onChange(<any> null, this.state.value.toString());
                }
                if (this.props.onBlur) {
                    this.props.onBlur(evt);
                }
            },
        });
    }
}
