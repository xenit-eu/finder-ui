import { Component, createElement as __, DOM as _, ReactElement } from "react";
import "./resizer.less";

declare var require: (moduleId: string) => any;
const ReactResizer = require("react-resizer");

type State_t = {
    width: number,
    displayContent: boolean,
};

type Resizable_t = {
    initialWidth: number,
    width?: number,
    minWidth?: number,
    maxWidth?: number,
    children?: ReactElement<any>[],

    onResize?: (width: number) => void,
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

    private onResize(diff: number) {
        // avoid to resize more that what's allowed by the available screen width (avoid horizontal scroll bar)
        const newWidth = this.state.width + diff;
        const ok = (newWidth >= (this.props.minWidth || 0)) && (newWidth <= (this.props.maxWidth || Infinity));
        if (ok) {
            this.setState({ width: newWidth } as State_t);
            if(this.props.onResize) {
                this.props.onResize(newWidth);
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
        return __(ReactResizer, {
            onResize: this.onResize,
            onResizeStart: this.onResizeStart,
            onResizeEnd: this.onResizeEnd,
        }, _.div({ className: "resizable", style: resizableStyle }, this.state.displayContent ? this.props.children : [  _.div({key: "placeholder", className: "place-holder"}, widthElem) ]));
    }
}