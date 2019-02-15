import { Avatar, Collapse, ListItem as ListItemMUIV1, ListItemAvatar, ListItemText, WithStyles, withStyles } from "@material-ui/core";
import FolderIcon from "@material-ui/icons/Folder";
import { CircularProgress, IconButton, List, ListItem } from "material-ui";
import { NavigationExpandLess } from "material-ui/svg-icons/navigation/expand-less";
import { NavigationExpandMore } from "material-ui/svg-icons/navigation/expand-more";

import { Component, createElement as __, ReactElement } from "react";
import classNames = require("classnames");

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

/**
 * @deprecated Use V2
 */
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
        if (!this.state.open || this.state.loaded || this.state.loading) {
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
        if (this.state.children.length === 0 && this.state.loaded) {
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
            nestedItems: this.state.children.map((child, i) => __(ExplorerNode, <any>{ ...this.props, key: i, node: child, nestedLevel: this.props.nestedLevel! + 1 })),
            rightIconButton: this._getRightIconButton(),
        });
    }
}
/**
 * @deprecated Use V2
 */
export function Explorer<T extends ExplorerNode_t>(props: Explorer_t<T>) {
    console.warn("Deprecated, use V2 instead.");
    return __(List, <any>{ className: "explorer" }, [
        __(ExplorerNode, { key: "rootExplorerNode", ...props, nestedLevel: 0 }),
    ]);
}
export function ExplorerV2<T extends ExplorerNode_t>(props: Explorer_t<T>) {
    return __(List, <any>{ className: "explorer" }, [
        __(StyledExplorerNodeV2, { key: "rootExplorerNode", ...props, nestedLevel: 0 }),
    ]);
}
export type ExplorerNodev2_t = {
    id: string,
    primaryText: string,
};

type ExplorerNodeV2_Props_t<T extends ExplorerNodev2_t> = Explorer_t<T> & {
    nestedLevel: number,
} & WithStyles<"node" | "nodeSelected">;

/*Material ui V1 component*/
class ExplorerNodeV2<T extends ExplorerNode_t> extends Component<ExplorerNodeV2_Props_t<T>, Explorer_State_t> {
    constructor(props: ExplorerNodeV2_Props_t<T>) {
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
        if (!this.state.open || this.state.loaded || this.state.loading) {
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
    private isOpenAndLoaded() {
        return this.state.open && this.state.loaded;
    }
    private _getRightIconButton() {
        const onClick = (event: any) => {
            event.stopPropagation(); this._doToggle();
        };

        const icon = this.state.open ? (this.state.loading ? __(CircularProgress, { size: 24 }) : __(NavigationExpandLess)) : __(NavigationExpandMore);

        return __(IconButton, {
            onClick,
            className: "explorer-node-expander",
        }, icon);
    }

    public render(): ReactElement<any> {
        const isSelected = this.props.selectedNodes && this.props.selectedNodes.indexOf(this.props.node.id) >= 0;
        const nestedItems = this.state.children.map((child, i) => __(ExplorerNodeV2, <any>{ ...this.props, key: i, node: child, nestedLevel: this.props.nestedLevel! + 1 }));
        const listItem = __(ListItemMUIV1, {
            component: "div",
            onClick: () => this.props.onClick(this.props.node),
            onDrop: (event: any) => this.props.onDrop(this.props.node, event),
            onDragOver: (event: any) => event.preventDefault(),
            className: classNames(this.props.classes.node, {
                [this.props.classes.nodeSelected]: isSelected,
            }),
        },
            __(ListItemAvatar, {}, __(Avatar, {}, __(FolderIcon, { color: isSelected ? "primary" : "inherit" }))),
            __(ListItemText, { className: "explorer-node-label", primary: this.props.node.primaryText }),
            this._getRightIconButton());
        const collapsible = __(Collapse, { in: this.isOpenAndLoaded(), style: { paddingLeft: "20px" }, className: "explorer-node-children" }, nestedItems);
        return __(List, <any>{
            style: {
                padding: "0px",
            },
            className: classNames("explorer-node", {
                "explorer-node-open": this.state.open,
                "explorer-node-loading": this.state.loading,
                "explorer-node-selected": isSelected,
            }),
        }, listItem, collapsible);
    }
}

const StyledExplorerNodeV2 = withStyles(theme => ({
    node: {
        paddingTop: "2px",
        paddingBottom: "2px",
        paddingLeft: "6px",
        paddingRight: 0,
        borderTopLeftRadius: "30px",
        borderBottomLeftRadius: "30px",
        cursor: "pointer",
    },
    nodeSelected: {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.contrastText,
    },

}), { name: "FinderUIExplorerNodeV2" })(ExplorerNodeV2);
