import { MenuItem, SelectField } from "material-ui";
import { Component, createElement as __, DOM as _, FormEvent, ReactElement } from "react";

import { FieldSkeleton_Props_t, RenderMode } from "../fields";
import { PropertyRenderConfig_t, PropertyRenderer_t } from "./interface";

type KV_t = {
    key: string,
    value: string,
};

type SelectBox_State_t = {
    menuItems: KV_t[],
    menuItemsLoaded: boolean,
    currentValues: KV_t[],
    currentValuesLoaded: boolean,
};

const SelectBox: PropertyRenderer_t<string | string[]> = (config: PropertyRenderConfig_t<string | string[]>) => {
    class SelectBoxInner extends Component<FieldSkeleton_Props_t, SelectBox_State_t> {
        constructor(props: FieldSkeleton_Props_t) {
            super(props);
            this.state = {
                menuItems: [],
                menuItemsLoaded: false,
                currentValues: [],
                currentValuesLoaded: false,
            };
        }

        private lookupCurrentValues() {
            this.setState({ currentValuesLoaded: false }, () => {
                config.parameters.resolver.lookup(config.mapToView(this.props.node))
                    .then((items: KV_t[]) => this.setState({ currentValues: items, currentValuesLoaded: true }));
            });
        }

        private lookupMenuItems() {
            this.setState({ menuItemsLoaded: false }, () => {
                config.parameters.resolver.query([], {})
                    .then((items: KV_t[]) => this.setState({ menuItems: items, menuItemsLoaded: true }));
            });
        }

        public componentDidMount() {
            this.lookupCurrentValues();
            this.lookupMenuItems();
        }

        public componentWillReceiveProps(nextProps: FieldSkeleton_Props_t) {
            if(nextProps.node !== this.props.node) {
                this.lookupCurrentValues();
            }
        }

        public render() {
            let value = config.mapToView(this.props.node);
            const isMultiValue = Array.isArray(value);
            if (this.props.renderMode !== RenderMode.VIEW && this.state.menuItemsLoaded) {
                const menuItems = this.state.menuItems.map((item: KV_t) => __(MenuItem, {
                    key: item.key,
                    value: item.key,
                    primaryText: item.value,
                    insetChildren: isMultiValue,
                    checked: isMultiValue && value.indexOf(item.key) >= 0,
                }));
                return _.span({ className: "metadata-field" }, __(SelectField, {
                    fullWidth: true,
                    multiple: isMultiValue,
                    hintText: "Select value",
                    onChange: (evt: FormEvent<{}>, key, values: string|string[]) => {
                        this.props.onChange(config.mapToModel(this.props.node, values));
                    },
                    value,
                }, menuItems));
            } else {
                let values = isMultiValue?value:[value];
                if(this.state.currentValuesLoaded) {
                    values = this.state.currentValues.map(item => item.value);
                }
                return _.span({ className: "metadata-value" }, values.join(", "));
            }
        }
    }

    return SelectBoxInner;
};
export default SelectBox;
