import { CircularProgress, Dialog, FlatButton } from "material-ui";
import { Component, ComponentType, createElement as __, DOM as _, ReactElement } from "react";
import { RenderMode } from "./index";

export function arrayEquals<T>(a: T[], b: T[], cmp: (a: T, b: T) => boolean = (x: T, y: T) => x === y): boolean {
    if(a.length !== b.length) {
        return false;
    }
    for(let i = a.length-1; i >= 0; i--) {
        if (!cmp(a[i], b[i])) {
            return false;
        }
    }
    return true;
}

type MetadataPanel_Item_t<T> = ComponentType<{node: T[], onChange: (node: T[]) => void, renderMode: RenderMode}>;

export type MetadataPanel_Props_t<T> = {
    /**
     * List of nodes to display
     */
    nodes: T[],
    /**
     * Load form skeletons that should be used for the nodes
     */
    onLoadNodeFormskeleton: (node: T[]) => Promise<Array<MetadataPanel_Item_t<T>>>
    /**
     * Called when node editing has been cancelled by the user
     */
    onCancel: () => void,
    /**
     * Whether to show buttons to edit/save or not
     */
    showButtons: boolean,
    /**
     * Checks if the nodes to be displayed did change.
     * This is used to determine if the component should return to the initial render mode when the nodes list changes
     */
    didNodeChange?: (node: T, prevNode: T) => boolean,
    /**
     * Checks if the changed/updated node should result in a reload of the form skeletons
     * By default, every change on a node results in a relad of the skeletons.
     * Since this operation may be very expensive, it is recommended to implement this function
     * so form skeletons are only reload when node data that affects the skeletons that are shown is modified
     */
    shouldFormSkeletonUpdate?: (node: T, prevNode: T) => boolean,
    /**
     * The initial render mode the panel is in, before any buttons are used.
     * When the nodes change (as determined by #didNodeChange()), the panel returns back to the initial render mode.
     */
    initialRenderMode?: RenderMode,
} & ({
    /**
     * Called when the save button is pressed in edit mode
     * Called for every node that should be saved
     */
    onSave: (node: T, originalNode: T) => Promise<boolean>,
    onSaveAll: undefined,
} | {
    /**
     * Called when the save button is pressed in edit mode
     * Called once for all nodes that have to be saved
     */
    onSaveAll: (node: T[], originalNode: T[]) => Promise<boolean>,
    onSave: undefined,
});

type MetadataPanel_State_t<T> = {
    nodes: T[],
    renderMode: RenderMode,
    skeletons: Array<MetadataPanel_Item_t<T>> | null,
    loading: boolean,
    error: string|null,
};

export class MetadataPanel<T> extends Component<MetadataPanel_Props_t<T>, MetadataPanel_State_t<T>> {
    constructor(props: MetadataPanel_Props_t<T>) {
        super(props);
        this.state = {
            nodes: props.nodes,
            renderMode: props.initialRenderMode || RenderMode.VIEW,
            skeletons: null,
            loading: true,
            error: null,
        };
    }

    protected loadSkeletonsForNodes(nodes: T[]) {
        this.setState({
            loading: true,
            error: null,
        }, () => {
            this.props.onLoadNodeFormskeleton(nodes).then(skeletons => {
                this.setState({
                    skeletons,
                    loading: false,
                });
            }).catch(e => {
                this.setState({
                    skeletons: null,
                    loading: false,
                    error: e.toString(),
                });
            });
        });
    }

    public componentDidMount() {
        this.loadSkeletonsForNodes(this.props.nodes);
    }

    public componentWillReceiveProps(nextProps: MetadataPanel_Props_t<T>) {
        if(arrayEquals(this.props.nodes, nextProps.nodes, (a, b) => this.didNodeChange(a, b))) {
            this.setState({
                nodes: nextProps.nodes,
                renderMode: this.props.initialRenderMode || RenderMode.VIEW,
            });
        }
        if (!arrayEquals(this.props.nodes, nextProps.nodes, (a, b) => this.shouldFormSkeletonUpdate(a, b))) {
            this.loadSkeletonsForNodes(nextProps.nodes);
        }
    }

    protected getButtons(): Array<ReactElement<any>> {
        if(!this.props.showButtons) {
            return [];
        }
        switch (this.state.renderMode) {
            case RenderMode.VIEW:
                return [__(FlatButton, {
                    label: "Edit",
                    primary: true,
                    keyboardFocused: false,
                    onClick: () => this._onEdit(),
                })];
            default:
                return [
                    __(FlatButton, {
                        label: "Save",
                        primary: true,
                        keyboardFocused: false,
                        onClick: () => this._onSave(),
                    }),
                    __(FlatButton, {
                        label: "Cancel",
                        keyboardFocused: false,
                        onClick: () => this._onCancel(),
                    }),
                ];
        }
    }

    protected didNodeChange(node: T, prevNode: T): boolean {
        return this.props.didNodeChange ? this.props.didNodeChange(node, prevNode) : node !== prevNode;
    }

    protected shouldFormSkeletonUpdate(node: T, prevNode: T): boolean {
        return this.props.shouldFormSkeletonUpdate ? this.props.shouldFormSkeletonUpdate(node, prevNode) : true;
    }

    public render(): ReactElement<any> {
        if(this.state.loading) {
            return __(CircularProgress);
        } else if (!this.state.skeletons) {
            return _.span({ style: { color: "red" } }, "Error loading metadata form skeleton: " + this.state.error);
        }

        return _.div({ className: "metadata-content" },
            _.div({ key: "metadata-header", className: "metadata-header" }, this.getButtons()),
            _.div({ key: "metadata-error", className: "metadata-error" }, this.state.error),
            ...this.state.skeletons.map(skeleton => __(skeleton, {
                node: this.state.nodes,
                onChange: this._onChange.bind(this),
                renderMode: this.state.renderMode,
            })),
        );
    }

    private _getSavePromise(): Promise<boolean> {
        if(this.props.onSaveAll) {
            return this.props.onSaveAll(this.state.nodes, this.props.nodes);
        } else {
            return Promise.all(this.state.nodes.map((node, index) => this.props.onSave!(node, this.props.nodes[index])))
                .then(results => results.reduce((a, b) => a && b));
        }
    }

    private _onSave() {
        this.setState({ error: null });
        this._getSavePromise()
            .then(result => result && this.setState({ renderMode: RenderMode.VIEW }))
            .catch(e => this.setState({ error: e.toString() }));
    }

    private _onCancel() {
        this.setState({ renderMode: RenderMode.VIEW, nodes: this.props.nodes }, this.props.onCancel);
    }

    private _onEdit() {
        this.setState({ renderMode: RenderMode.EDIT });
    }

    private _onChange(nodes: T[]) {
        if (!arrayEquals(nodes, this.props.nodes, (a, b) => this.shouldFormSkeletonUpdate(a, b))) {
            this.loadSkeletonsForNodes(nodes);
        }
        this.setState({ nodes });
    }
}
