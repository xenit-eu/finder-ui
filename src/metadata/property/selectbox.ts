import Checkbox from "@material-ui/core/Checkbox";
import Chip from "@material-ui/core/Chip";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import * as ld from "lodash";
import { TextField } from "material-ui";
import { ChangeEvent, Component, createElement as __, SyntheticEvent } from "react";
import * as _ from "react-dom-factories";

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
    open: boolean,
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
                open: false,
            };
        }

        private _getSanitizedValue(): string[] | string {
            const value = config.mapToView(this.props.node);
            return Array.isArray(value) ? value.map(v => v.toString()) : value ? value.toString() : "";
        }

        private _getViewValue(): string[] {
            const value = this._getSanitizedValue();
            return Array.isArray(value) ? value : value ? [value] : [];
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
            if (searchFilter === this.state.searchFilter) {
                return Promise.resolve();
            }
            return this.setStateP({ menuItemsLoaded: false, searchFilter })
                .then(() => config.parameters.resolver.query(this._getViewValue(), { 0: searchFilter }))
                .then((items: KV_t[]) => this.setStateP({ menuItems: items, menuItemsLoaded: true }));
        }

        public componentDidMount() {
            this.lookupCurrentValues();
            if (this.props.renderMode !== RenderMode.VIEW) {
                this.lookupMenuItems();
            }
        }

        public componentWillReceiveProps(nextProps: FieldSkeleton_Props_t) {
            if (!ld.isEqual(nextProps.node, this.props.node)) {
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
            let viewValues = this._getViewValue();
            if (this.state.currentValuesLoaded) {
                viewValues = this.state.currentValues.map((item, i) => item ? item.value : viewValues[i]);
            }
            if (this.props.renderMode !== RenderMode.VIEW) {

                // Place the current values in the menu if there are no menu items shown initially
                // This is a workaround for XENFIN-769 where the value displayed in a SelectField
                // is empty because no menu items are present.
                // This happens when using a custom resource resolver with min-input-length > 0
                // Not a problem for multivalue, because the selectionRenderer is always called for multivalue fields
                const useCurrentValues = this.state.menuItems.length === 0 && !this.state.searchFilter && !isMultiValue;
                const menuItems = useCurrentValues ? this.state.currentValues.filter(v => !!v) : this.state.menuItems;

                const menuItemComponents = menuItems.map((item: KV_t) => __(MenuItem, {
                    key: item.key,
                    value: item.key,
                },
                    isMultiValue && __(Checkbox, {
                        checked: value !== null ? value.indexOf(item.key) >= 0 : false,
                    }),
                    __(ListItemText, {
                        primary: item.value,
                    }),
                ));

                if (!isMultiValue && !config.parameters.required) {
                    menuItemComponents.unshift(__(MenuItem, {
                        key: "--empty",
                        value: "",
                    },
                        __(ListItemText, {
                            primary: _.em({}, "Empty"),
                        }),
                    ));
                }

                const searchBox = __(MenuItem, {
                    key: "--searchBox",
                },
                    __(TextField, {
                        fullWidth: true,
                        hintText: "Filter",
                        onKeyDown: (ev: SyntheticEvent<{}>) => { ev.stopPropagation(); },
                        onChange: (ev: SyntheticEvent<{}>, newValue: string) => { this.lookupMenuItems(newValue); ev.stopPropagation(); },
                        value: this.state.searchFilter,
                    }),
                );

                const selectProps = isMultiValue ? {
                    multiple: true,
                    onClose: () => this.setState({ open: false }),
                    onChange: (evt: ChangeEvent<HTMLSelectElement>) => {
                        let val = evt.target.value as any as string[];
                        // Filter out "undefined" values from clicking the searchbox
                        if (Array.isArray(val)) {
                            val = val.filter(v => !!v);
                        }
                        this.props.onChange(config.mapToModel(this.props.node, val));
                    },
                    renderValue: () => {
                        if (this.state.currentValues.length === 0) {
                            return _.em({}, "None");
                        }
                        return _.div({ style: { display: "flex", flexWrap: "wrap" } }, this.state.currentValues.map((va: KV_t) => __(Chip, { key: va.key, label: va.value })));

                    },
                } : {
                        multiple: false,
                        onClose: () => { }, // Required when controlled component
                        onChange: (evt: ChangeEvent<HTMLSelectElement>) => {
                            if (evt.target.value !== undefined) {
                                this.setState({ open: false });
                                this.props.onChange(config.mapToModel(this.props.node, evt.target.value));
                            }
                        },
                        renderValue: () => {
                            const items = this.state.currentValues;
                            return (items.length >= 1 ? items[0].value : value) || _.em({}, "Empty");
                        },
                    };

                /*
                 * The story of *open*
                 *
                 * A singlevalue selectbox closes as soon as one value is selected, or when a click outside the menu happens.
                 * A multivalue selectbox only closes when a click outside the menu happens.
                 *
                 * We have a searchbox embedded inside the menu. Clicking the searchbox triggers a selection on the menu, which
                 * causes the single value selectbox to close immediately.
                 *
                 * To avoid this undesired closing, we keep the Select as a controlled component, which we explicitly tell to open and close.
                 * However, in case of multivalue, we still want to close as the default action.
                 *
                 * For the single value case:
                 * * Because we still want to close on clickaway, even in the single value select, we also attach an eventlistener to MenuProps.onClose.
                 * * Because we also want to close on change, we close when the evt.target.value is not empty
                 */
                return _.span({ className: "metadata-field metadata-field-selectbox" },
                    __(Select, {
                        fullWidth: true,
                        displayEmpty: true,
                        multiple: isMultiValue,
                        open: this.state.open,
                        onOpen: () => this.setState({ open: true }),
                        MenuProps: {
                            onExited: () => this.lookupMenuItems(),
                            onClose: () => this.setState({ open: false }),
                        },
                        value,
                        ...selectProps,
                    },
                        searchBox,
                        ...menuItemComponents,
                    ),
                );
            } else {
                return _.span(
                    { className: "metadata-value metadata-field-selectbox" },
                    this.state.currentValuesLoaded ? viewValues.join(", ") : "Loading...");
            }
        }
    }

    return SelectBoxInner;
};
export default SelectBox;
