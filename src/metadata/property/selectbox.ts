import { MenuItem, SelectField, TextField } from "material-ui";
import { Component, createElement as __, DOM as _, FormEvent, ReactElement, SyntheticEvent } from "react";

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
    searchFilter?: string,
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
                searchFilter: undefined,
            };
        }

        private _getSanitizedValue(): string[]|string|null {
            const value = config.mapToView(this.props.node);
            return Array.isArray(value) ? value.map(v => v.toString()) : value !== null ? value.toString() : null;
        }

        private _getViewValue(): string[] {
            const value = this._getSanitizedValue();
            return Array.isArray(value) ? value : value !== null ? [value] : [];
        }

        private setStateP<K extends keyof SelectBox_State_t>(state: Pick<SelectBox_State_t, K>): Promise<void> {
            return (new Promise(resolve => this.setState(state, resolve)));
        }

        private lookupCurrentValues() {
            return this.setStateP({ currentValuesLoaded: false })
                .then(() => config.parameters.resolver.lookup(this._getViewValue()))
                .then((items: KV_t[]) => this.setStateP({ currentValues: items, currentValuesLoaded: true }));
        }

        private lookupMenuItems(searchFilter: string = "") {
            if(searchFilter === this.state.searchFilter) {
                return Promise.resolve();
            }
            return this.setStateP({ menuItemsLoaded: false, searchFilter})
                .then(() => config.parameters.resolver.query(this._getViewValue(), { 0: searchFilter }))
                .then((items: KV_t[]) => this.setStateP({ menuItems: items, menuItemsLoaded: true }));
        }

        public componentDidMount() {
            this.lookupCurrentValues();
            if(this.props.renderMode !== RenderMode.VIEW) {
                this.lookupMenuItems();
            }
        }

        public componentWillReceiveProps(nextProps: FieldSkeleton_Props_t) {
            if(nextProps.node !== this.props.node) {
                this.lookupCurrentValues();
            }
        }

        public componentDidUpdate(prevProps: FieldSkeleton_Props_t) {
            if (this.props.renderMode !== RenderMode.VIEW && !this.state.menuItemsLoaded && this.props.renderMode !== prevProps.renderMode) {
                this.lookupMenuItems();
            }
        }

        public render() {
            let value = this._getSanitizedValue();
            const isMultiValue = Array.isArray(value);
            if (this.props.renderMode !== RenderMode.VIEW) {
                const menuItems = this.state.menuItems.map((item: KV_t) => __(MenuItem, {
                    key: item.key,
                    value: item.key,
                    primaryText: item.value,
                    insetChildren: isMultiValue,
                    checked: isMultiValue && value !== null ? value.indexOf(item.key) >= 0 : false,
                }));
                const searchBox = _.div({
                    style: {
                        padding: "0 24px",
                    },
                },
                    __(TextField, {
                        fullWidth: true,
                        hintText: "Filter",
                        onKeyDown: (ev: SyntheticEvent<{}>) => { ev.stopPropagation(); },
                        onChange: (ev: SyntheticEvent<{}>, newValue: string) => { this.lookupMenuItems(newValue); ev.stopPropagation(); },
                        value: this.state.searchFilter,
                    }),
                );

                return _.span({ className: "metadata-field metadata-field-selectbox" },
                    __(SelectField, <any>{
                        fullWidth: true,
                        multiple: isMultiValue,
                        hintText: "Select value",
                        onChange: (evt: FormEvent<{}>, key: number, values: string | string[]) => {
                            this.props.onChange(config.mapToModel(this.props.node, values));
                        },
                        dropDownMenuProps: {
                            onClose: () => this.lookupMenuItems(),
                        },
                        value,
                    },
                        searchBox,
                        ...menuItems,
                    ),
                );
            } else {
                let values = this._getViewValue();
                if(this.state.currentValuesLoaded) {
                    values = this.state.currentValues.map((item, i) => item ? item.value : values[i]);
                }
                return _.span({ className: "metadata-value metadata-field-selectbox" }, values.join(", "));
            }
        }
    }

    return SelectBoxInner;
};
export default SelectBox;
