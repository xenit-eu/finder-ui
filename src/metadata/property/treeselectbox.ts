import { MenuItem, SelectField, TextField } from "material-ui";
import { Component, createElement as __, DOM as _, FormEvent, ReactElement, SyntheticEvent } from "react";

import { FieldSkeleton_Props_t, RenderMode } from "../fields";
import { PropertyRenderConfig_t, PropertyRenderer_t } from "./interface";

type Tree_t = {
    key: string,
    value: string,
    parent?: string,
};

type TreeSelectBoxInner_State_t = {
    menuItems: Tree_t[],
    menuItemsLoaded: boolean,
    currentValues: Tree_t[],
    currentValuesLoaded: boolean,
};

const TreeSelectBox: PropertyRenderer_t<string[]|string> = (config: PropertyRenderConfig_t<string[]|string>) => {
    class TreeSelectBoxInner extends Component<FieldSkeleton_Props_t, TreeSelectBoxInner_State_t> {
        constructor(props: FieldSkeleton_Props_t) {
            super(props);
            this.state = {
                menuItems: [],
                menuItemsLoaded: false,
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
                config.parameters.resolver.lookup(this._getViewValue())
                    .then((items: Tree_t[]) => this.setState({ currentValues: items, currentValuesLoaded: true }));
            });
        }

        private lookupMenuItems() {
            this.setState({ menuItemsLoaded: false }, () => {
                config.parameters.resolver.query(this._getViewValue(), {})
                    .then((items: Tree_t[]) => this.setState({ menuItems: items, menuItemsLoaded: true }));
            });
        }

        public componentDidMount() {
            this.lookupCurrentValues();
            this.lookupMenuItems();
        }

        public componentWillReceiveProps(nextProps: FieldSkeleton_Props_t) {
            if (nextProps.node !== this.props.node) {
                this.lookupCurrentValues();
            }
        }

        public render() {
            let value = config.mapToView(this.props.node);
            const isMultiValue = Array.isArray(value);
            if (this.props.renderMode !== RenderMode.VIEW && this.state.menuItemsLoaded) {
                const menuItems = __(TreeSelectBoxImpl, {
                    treeDescription: this.state.menuItems,
                    multiple: isMultiValue,
                    onChange: (values: string[]|string) => {
                        this.props.onChange(config.mapToModel(this.props.node, values));
                    },
                    value,
                });
                let values = this._getViewValue();
                if (this.state.currentValuesLoaded) {
                    values = this.state.currentValues.map(item => item.value);
                }
                return _.span({ className: "metadata-field" }, __(SelectField, {
                    value: values,
                    multiple: true,
                    fullWidth: true,
                    selectionRenderer: () => values.join(", "),
                }, menuItems));
            } else {
                let values = this._getViewValue();
                if (this.state.currentValuesLoaded) {
                    values = this.state.currentValues.map(item => item.value);
                }
                return _.span({ className: "metadata-value" }, values.join(", "));
            }
        }
    }

    return TreeSelectBoxInner;
};
export default TreeSelectBox;

const CheckboxTree = require("react-checkbox-tree");
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import "./treeselectbox.less";

type TreeSelectBoxImpl_Props_t = {
    treeDescription: Tree_t[],
    value: string[] | string,
    multiple: boolean,
    onChange: (value: string[]|string) => void,
};

type TreeSelectBoxImpl_State_t = {
    expanded: string[],
    searchFilter: string,
};

type CheckboxTreeData_t = {
    value: string,
    label: string,
    children: CheckboxTreeData_t[],
};

class TreeSelectBoxImpl extends Component<TreeSelectBoxImpl_Props_t, TreeSelectBoxImpl_State_t> {
    constructor(props: TreeSelectBoxImpl_Props_t) {
        super(props);
        this.state = {
            expanded: this._getParentsFor(<string[]>(props.multiple ? props.value : [props.value])),
            searchFilter: "",
        };
    }

    private _getParents(nodeKey?: string): string[] {
        if (!nodeKey) {
            return [];
        }
        const node = this.props.treeDescription.find(n => n.key === nodeKey);
        if (!node) {
            return [];
        }
        return [node.key].concat(this._getParents(node.parent));
    }

    private _getParentsFor(values: string[]): string[] {
        const selectedNodes = this.props.treeDescription
            .filter(node => values.indexOf(node.key) >= 0);
        return (<string[]>[]).concat(...selectedNodes.map(node => this._getParents(node.parent)));
    }

    private _getFilteredValues(filter: string) {
        const matchingNodes = this.props.treeDescription
            .filter(node => node.value.toLowerCase().indexOf(filter.toLowerCase()) >= 0);
        return (<string[]>[]).concat(...matchingNodes.map(node => this._getParents(node.key).concat([node.key])));
    }

    private _getFilteredTreeDescription() {
        if(!this.state.searchFilter) {
            return this.props.treeDescription;
        }
        const filteredNodes = this._getFilteredValues(this.state.searchFilter);
        return this.props.treeDescription.filter(node => filteredNodes.indexOf(node.key) >= 0);
    }

    private _buildNodesTree(nodeKey?: string): CheckboxTreeData_t[] {
        return this._getFilteredTreeDescription()
            .filter(node => node.parent === nodeKey)
            .map(node => ({
                value: node.key,
                label: node.value,
                children: this._buildNodesTree(node.key),
                className: this.props.value.indexOf(node.key) >= 0? "treeselectbox-checked":"treeselectbox-unchecked",
            }));
    }

    private _onCheck(checked: string[]) {
        if(this.props.multiple) {
            this.props.onChange(checked);
        } else {
            const newlyChecked = checked.filter(item => this.props.value.indexOf(item) === -1);
            if(newlyChecked[0]) {
                this.props.onChange(newlyChecked[0]);
            } else {
                this.props.onChange(this.props.value);
            }
        }
    }

    public render() {
        return _.div({
            style: {
                padding: "0 24px",
            },
            className: this.props.multiple ? "react-checkbox-tree-multiple" : "react-checkbox-tree-single",
        },
            __(TextField, {
                fullWidth: true,
                hintText: "Filter",
                onKeyDown: (ev: SyntheticEvent<{}>) => { ev.stopPropagation(); },
                onChange: (ev: SyntheticEvent<{}>, newValue: string) => {
                    this.setState({ searchFilter: newValue, expanded: newValue ? this._getFilteredValues(newValue) : this.state.expanded });
                    ev.stopPropagation();
                },
                value: this.state.searchFilter,
            }),
            __(CheckboxTree, {
                nodes: this._buildNodesTree(),
                checked: this.props.multiple ? this.props.value : [this.props.value],
                expanded: this.state.expanded,
                onCheck: (checked: string[]) => this._onCheck(checked),
                onExpand: (expanded: string[]) => this.setState({ expanded }),
                noCascade: true,
            }),
        );
    }
}
