import { Component, createElement as __, DOM as _, ReactElement } from "react";
import "./resizer.less";

type State_t = {
    width: number,
    displayContent: boolean,
};

type Resizable_t = {
    initialWidth: number,
    width?: number,
    minWidth?: number,
    maxWidth?: number,
    ReactResizer: any,
    children?: ReactElement<any>[],

    onResize?: (width: number) => boolean,
};

export class Resizer extends Component<Resizable_t, State_t> {

    constructor(props: Resizable_t) {
        super(props);
        this.state = {
            width: props.width || props.initialWidth,
            displayContent: true,
        };
        this.onResize = this.onResize.bind(this);
        this.onResizeStart = this.onResizeStart.bind(this);
        this.onResizeEnd = this.onResizeEnd.bind(this);
    }

    public componentWillReceiveProps(newProps: Resizable_t) {
        if(newProps.width && newProps.width !== this.state.width) {
            this.setState({ width: newProps.width } as State_t);
        }
    }

    private onResize(diff: number) {
        // avoid to resize more that what's allowed by the available screen width (avoid horizontal scroll bar)
        const newWidth = this.state.width + diff;
        const ok = (newWidth >= (this.props.minWidth || 0)) && (newWidth <= (this.props.maxWidth || Infinity));
        if (ok) {
            const onResize = this.props.onResize ? this.props.onResize : (x: number) => true;
            if(onResize(newWidth)) {
                this.setState({ width: newWidth } as State_t);
            }
        }
    }

    private onResizeStart() {
        // display placeholder during move because otherwise laggy behaviour when content is complex.
        this.setState({displayContent: false} as State_t);
    }

    private onResizeEnd() {
        this.setState({displayContent: true} as State_t);
    }

    public render() {
        const resizableStyle = {
            width: this.state.width,
            maxWidth: this.state.width,
            flexBase: this.state.width,
        };
        const widthElem = _.span({}, [_.i({className: "fa fa-arrow-left"}), " " + this.state.width + "px ", _.i({className: "fa fa-arrow-right"})]);
        const children = this.state.displayContent ? this.props.children : [_.div({ key: "placeholder", className: "place-holder" }, widthElem)];
        return __(this.props.ReactResizer, {
            onResize: this.onResize,
            onResizeStart: this.onResizeStart,
            onResizeEnd: this.onResizeEnd,
        }, _.div({ className: "resizable", style: resizableStyle }, <any>children));
    }
}
