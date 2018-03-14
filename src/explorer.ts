import { Avatar, Badge, CircularProgress, IconButton, List, ListItem } from "material-ui";
import { NavigationExpandLess, NavigationExpandMore } from "material-ui/svg-icons";
import { Component, createElement as __, ReactElement} from "react";

export type Explorer_t<T extends ExplorerNode_t> = {
    onClick: (node: T) => void,
    onRequestChildren: (node: T) => Promise<T[]>,
    onDrop: (node: T, event: any) => void,
    selectedNodes?: string[],
    node: T,
};

export type ExplorerNode_t = {
    id: string,
    primaryText: string,
    icon?: ReactElement<any>,
};

type ExplorerNode_Props_t<T extends ExplorerNode_t> = Explorer_t<T> & {
    nestedLevel: number,
};

type Explorer_State_t = {
    children: ExplorerNode_t[],
    loading: boolean,
    loaded: boolean,
    open: boolean,
};

class ExplorerNode<T extends ExplorerNode_t> extends Component<ExplorerNode_Props_t<T>, Explorer_State_t> {
    constructor(props: ExplorerNode_Props_t<T>) {
        super(props);
        this.state = {
            children: [],
            loading: false,
            loaded: false,
            open: false,
        };
    }

    private _doToggle() {
        this.setState({
            open: !this.state.open,
        }, () => this._doLoadChildren());
    }

    private _doLoadChildren() {
        if(!this.state.open || this.state.loaded || this.state.loading) {
            return;
        }

        this.setState({
            loading: true,
        }, () => {
            this.props.onRequestChildren(this.props.node).then(children => {
                this.setState({
                    children,
                    loading: false,
                    loaded: true,
                });
            }).catch(e => this.setState({ loading: false, open: false }));
        });
    }

    private _getRightIconButton() {
        if (this.state.loading && this.state.open) {
            return __(IconButton, {
                onClick: () => this._doToggle(),
            }, __(CircularProgress, { size: 24 }));
        }
        if(this.state.children.length === 0 && this.state.loaded) {
            return undefined;
        }
        return __(IconButton, {
            onClick: () => this._doToggle(),
        }, __(this.state.open ? NavigationExpandLess : NavigationExpandMore));
    }

    public render(): ReactElement<any> {
        const isSelected = this.props.selectedNodes && this.props.selectedNodes.indexOf(this.props.node.id) >= 0;
        return __(ListItem, {
            onClick: () => this.props.onClick(this.props.node),
            onDrop: (event: any) => this.props.onDrop(this.props.node, event),
            onDragOver: (event: any) => event.preventDefault(),
            onNestedListToggle: () => this._doToggle(),
            nestedLevel: this.props.nestedLevel,
            open: this.state.open,
            primaryText: this.props.node.primaryText,
            primaryTogglesNestedList: false,
            leftAvatar: this.props.node.icon,
            className: isSelected ? "explorer-selected" : "",
            nestedItems: this.state.children.map(child => __(ExplorerNode, { ...this.props, node: child, nestedLevel: this.props.nestedLevel + 1 })),
            rightIconButton: this._getRightIconButton(),
        });
    }
}

export function Explorer<T extends ExplorerNode_t>(props: Explorer_t<T>) {
    return __(List, <any>{ className: "explorer" }, [
        __(ExplorerNode, { ...props, nestedLevel: 0 }),
    ]);
}
