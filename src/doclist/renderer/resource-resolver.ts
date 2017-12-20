import { Component, DOM as _ } from "react";
import { ColumnRenderer_Config_t, ColumnRenderer_Factory_t, ColumnRenderer_Props_t, ColumnRenderer_t } from "./interface";

type KV_t = {
    key: string,
    value: string,
};

type Location_State_t = {
    items: KV_t[],
    itemsLoaded: boolean,
    loadError: string | null,
};

const ResourceResolverRenderer: ColumnRenderer_Factory_t<string> = (config: ColumnRenderer_Config_t<string>): ColumnRenderer_t => {
    // tslint:disable-next-line:only-arrow-functions
    class ResourceResolver extends Component<ColumnRenderer_Props_t, Location_State_t> {
        constructor(props: ColumnRenderer_Props_t) {
            super(props);
            this.state = {
                items: [],
                itemsLoaded: false,
                loadError: null,
            };
        }

        private _getViewValue(): string[] {
            const value = config.mapToView(this.props.node);
            return Array.isArray(value)?value:[value];
        }

        private lookupItems() {
            this.setState({ itemsLoaded: false, loadError: null }, () => {
                config.parameters.resolver.lookup(this._getViewValue())
                    .then((items: KV_t[]) => this.setState({ items, itemsLoaded: true }))
                    .catch((e: any) => this.setState({ loadError: e.toString() }));
            });
        }

        public componentDidMount() {
            this.lookupItems();
        }

        public componentWillReceiveProps(nextProps: ColumnRenderer_Props_t) {
            if(nextProps.node !== this.props.node) {
                this.lookupItems();
            }
        }

        public render() {
            if(this.state.loadError !== null) {
                return _.span({ className: "doclist-renderer-error" }, "Error loading resource: " + this.state.loadError);
            }
            if(!this.state.itemsLoaded) {
                return _.span({ className: "doclist-renderer-loading" }, "Loading...");
            } else {
                return _.span({}, this.state.items.map(kv => kv.value).join(", "));
            }
        }

    }

    return ResourceResolver;
};
export default ResourceResolverRenderer;
