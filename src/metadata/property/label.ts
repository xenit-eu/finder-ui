import { Component, createElement as __, DOM as _, FormEvent, ReactElement } from "react";

import { FieldSkeleton_Props_t, RenderMode } from "../fields";
import { PropertyRenderConfig_t, PropertyRenderer_t } from "./interface";

type KV_t = {
    key: string,
    value: string,
};

type Label_State_t = {
    currentValues: KV_t[],
    currentValuesLoaded: boolean,
};
const Label: PropertyRenderer_t<string | string[]> = (config: PropertyRenderConfig_t<string | string[]>) => {
    class LabelInner extends Component<FieldSkeleton_Props_t, Label_State_t> {
        constructor(props: FieldSkeleton_Props_t) {
            super(props);
            this.state = {
                currentValues: [],
                currentValuesLoaded: false,
            };
        }

        private _getViewValue(): string[] {
            const value = config.mapToView(this.props.node);
            return Array.isArray(value)?value:[value];
        }

        private lookupCurrentValues() {
            this.setState({ currentValuesLoaded: false }, () => {
                if(config.parameters.resolver) {
                    config.parameters.resolver.lookup(this._getViewValue())
                    .then((items: KV_t[]) => this.setState({ currentValues: items, currentValuesLoaded: true }));
                } else {
                    this.setState({currentValues: this._getViewValue().map(v => ({key: v, value: v})), currentValuesLoaded: true});
                }
            });
        }

        public componentDidMount() {
            this.lookupCurrentValues();
        }

        public componentWillReceiveProps(nextProps: FieldSkeleton_Props_t) {
            if(nextProps.node !== this.props.node) {
                this.lookupCurrentValues();
            }
        }

        render() {
            let values = this._getViewValue();
            if(this.state.currentValuesLoaded) {
                values = this.state.currentValues.map(item => item.value);
            }
            return _.span({ className: "metadata-value" }, values.join(", "));
        }

    }
    return LabelInner;
};
export default Label;
