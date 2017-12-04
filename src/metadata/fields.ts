import { Component, ComponentType, createElement as __, DOM as _, ReactElement } from "react";

export type TemplateProps_t<T, P> = { value: T, renderParameters: P, editEnabled: boolean, onChange: (value: T) => void };
export type Template_t<T, P> = ComponentType<TemplateProps_t<T, P>>;

export type Field_t<T, P> = {
    value: T,
    template: Template_t<T, P>,
    parameters: P,
};

type MetadataFields_t<T, P> = TemplateProps_t<T[], Array<Field_t<T, P>>>;

type MetadataFields_State_t<T> = {
    values: T[],
};

export class MetadataFields<T, P> extends Component<MetadataFields_t<T, P>, MetadataFields_State_t<T>> {
    constructor(props: MetadataFields_t<T, P>) {
        super(props);
        this.state = {
            values: props.value,
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
        this.setState({ values: props.value });
    }

    public render() {
        return _.div({ className: "metadata-fields" }, this.props.renderParameters.map((f, i) => __(f.template, {
            key: i,
            value: f.value,
            renderParameters: f.parameters,
            editEnabled: this.props.editEnabled,
            onChange: <(value: T) => void>this._onChange.bind(this, i),
        })));
    }
}
