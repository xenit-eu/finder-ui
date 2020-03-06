import { Component, createElement as __, ReactElement } from "react";
import * as _ from "react-dom-factories";
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
    children?: Array<ReactElement<any>>,

    onResize?: (width: number) => boolean,
};

export class Resizer extends Component<Resizable_t, State_t> {

    constructor(props: Resizable_t) {
        super(props);
        this.state = {
            width: props.width === undefined ? props.initialWidth : props.width,
            displayContent: true,
        };
        this.onResize = this.onResize.bind(this);
        this.onResizeStart = this.onResizeStart.bind(this);
        this.onResizeEnd = this.onResizeEnd.bind(this);
    }

    public componentWillReceiveProps(newProps: Resizable_t) {
        if (newProps.width !== undefined && newProps.width !== this.state.width) {
            this.setState({ width: newProps.width } as State_t);
        }
    }

    private onResize(diff: number) {
        // avoid to resize more that what's allowed by the available screen width (avoid horizontal scroll bar)
        const newWidth = this.state.width + diff;
        const minWidth = this.props.minWidth || 0;
        const maxWidth = this.props.maxWidth === undefined ? Infinity : this.props.maxWidth;
        const onResize = this.props.onResize ? this.props.onResize : (x: number) => true;
        const ok = (newWidth >= minWidth) && (newWidth <= maxWidth);
        if (ok && onResize(newWidth)) {
            this.setState({ width: newWidth } as State_t);
        }
        if (!ok) {
            const clampedWidth = Math.min(Math.max(newWidth, minWidth), maxWidth);
            this.setState({ width: clampedWidth } as State_t);
        }
    }

    private onResizeStart() {
        // display placeholder during move because otherwise laggy behaviour when content is complex.
        this.setState({ displayContent: false } as State_t);
    }

    private onResizeEnd() {
        this.setState({ displayContent: true } as State_t);
    }

    public render() {
        const resizableStyle = {
            width: this.state.width,
            maxWidth: this.state.width,
            flexBase: this.state.width,
        };
        const widthElem = _.span({}, [_.i({ className: "fa fa-arrow-left" }), " " + this.state.width + "px ", _.i({ className: "fa fa-arrow-right" })]);
        const children = this.state.displayContent ? this.props.children : [_.div({ key: "placeholder", className: "place-holder" }, widthElem)];
        return __(this.props.ReactResizer, {
            onResize: this.onResize,
            onResizeStart: this.onResizeStart,
            onResizeEnd: this.onResizeEnd,
        }, _.div({ className: "resizable", style: resizableStyle }, <any> children));
    }
}
