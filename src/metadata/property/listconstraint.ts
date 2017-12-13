import { MenuItem, SelectField } from "material-ui";
import { Component, createElement as __, DOM as _, FormEvent, ReactElement } from "react";

import { FieldSkeleton_Props_t, RenderMode } from "../fields";
import { PropertyRenderConfig_t, PropertyRenderer_t } from "./interface";

type KV_t = {
    key: string,
    value: string,
};

type ListConstraint_State_t = {
    menuItems: KV_t[],
    loaded: boolean,
};

const ListConstraint: PropertyRenderer_t<string> = (config: PropertyRenderConfig_t<string>) => {
    class ListConstraintInner extends Component<FieldSkeleton_Props_t, ListConstraint_State_t> {
        constructor(props: FieldSkeleton_Props_t) {
            super(props);
            this.state = {
                menuItems: [],
                loaded: false,
            };
        }

        public componentDidMount() {
            config.parameters.resolver.lookup([])
                .then((items: KV_t[]) => this.setState({ menuItems: items, loaded: true }));
        }

        public render() {
            if (this.props.renderMode !== RenderMode.VIEW && this.state.loaded) {
                const menuItems = this.state.menuItems.map((item: KV_t) => __(MenuItem, {
                    key: item.key,
                    value: item.key,
                    primaryText: item.value,
                }));
                return _.span({ className: "metadata-field" }, __(SelectField, {
                    fullWidth: true,
                    hintText: "Select value",
                    onChange: (evt: FormEvent<{}>, key: number) => {
                        this.props.onChange(config.mapToModel(this.props.node, this.state.menuItems[key].key));
                    },
                    value: config.mapToView(this.props.node),
                }, menuItems));
            } else {
                let value = config.mapToView(this.props.node);
                if(this.state.loaded) {
                    const item = this.state.menuItems.find(i => i.key === value);
                    if(item) {
                        value = item.value;
                    }
                }
                return _.span({ className: "metadata-value" }, value);
            }
        }
    }

    return ListConstraintInner;
};
export default ListConstraint;
