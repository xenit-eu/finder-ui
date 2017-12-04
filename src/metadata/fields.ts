import { Component, ComponentType, createElement as __, DOM as _, ReactElement } from "react";

export type Template_t<T, P> = ComponentType<{ value: T, renderParameters: P, editEnabled: boolean, onChange: (value: T) => void }>;

export type Field_t<T, P> = {
    value: T,
    template: Template_t<T, P>,
    parameters: P,
};

type MetadataFields_t<T, P> = {
    fields: Array<Field_t<T, P>>,
    editable: boolean,
    onChange: (value: T[]) => void,
};

type MetadataFields_State_t<T> = {
    values: T[],
};

export class MetadataFields<T, P> extends Component<MetadataFields_t<T, P>, MetadataFields_State_t<T>> {
    constructor(props: MetadataFields_t<T, P>) {
        super(props);
        this.state = {
            values: props.fields.map(f => f.value),
        };
    }

    private _onChange(key: number, value: T) {
        this.setState((prevState) => {
            const first = prevState.values.slice(0, key);
            const last = prevState.values.slice(key + 1);
            return { values: first.concat([value], last) };
        }, () => this.props.onChange(this.state.values));
    }

    public componentWillReceiveProps(props: MetadataFields_t<T, P>) {
        this.setState({ values: props.fields.map(f => f.value) });
    }

    public render() {
        return _.div({ className: "metadata-fields" }, this.props.fields.map((f, i) => __(f.template, {
            key: i,
            value: f.value,
            renderParameters: f.parameters,
            editEnabled: this.props.editable,
            onChange: <(value: T) => void>this._onChange.bind(this, i),
        })));
    }
}
