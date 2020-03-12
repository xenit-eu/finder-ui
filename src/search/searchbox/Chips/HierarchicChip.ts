
import keycode from "keycode";
import CancelIcon from "material-ui/svg-icons/navigation/cancel";
import { Component, createElement as __, ReactElement } from "react";
import * as _ from "react-dom-factories";
import "./HierarchicChip.less";

// tslint:disable-next-line:interface-name
export interface HierarchicChipProps {
    label: string;
    children: Array<ReactElement<any>>;
    onDelete?: (event: any) => void;
    onClick?: (event: any) => void;
    onKeyDown?: (event: any) => void;
    chipKey: string;
    containsFillInChip: boolean;
}
export class HierarchicChip extends Component<HierarchicChipProps, {}> {
    public handleDeleteIconClick(event: any) {
        event.stopPropagation();
        if (this.props.onDelete) {
            this.props.onDelete(event);
        }
    }

    public handleKeyDown(event: any) {
        // Ignore events from children of `Chip`.
        if (event.currentTarget !== event.target) {
            return;
        }

        const { onClick, onDelete, onKeyDown } = this.props;
        const key = keycode(event);

        if (onClick && (key === "space" || key === "enter")) {
            event.preventDefault();
            onClick(event);
        } else if (onDelete && key === "backspace") {
            event.preventDefault();
            onDelete(event);
        } else if (key === "esc") {
            event.preventDefault();
        }

        if (onKeyDown) {
            onKeyDown(event);
        }
    }

    public render(): ReactElement {
        const childrenInterleaved: any[] = [];
        this.props.children.forEach((c, i) => {
            childrenInterleaved.push(c);
            if (i < this.props.children.length - 1) {
                childrenInterleaved.push(_.span({ style: { margin: "2px" }, key: "inter" + i }, this.props.label));
            }
        });
        const growChipAdd = (this.props.containsFillInChip ? " growing-chip" : "");
        return _.div({
            className: "base-chip" + growChipAdd,
            key: this.props.chipKey,
        }, childrenInterleaved, __(CancelIcon, {
            color: "#000A",
            className: "cancel-icon",
            key: "CANCELINCON",
            onClick: (event: any) => this.handleDeleteIconClick(event),

        }));
    }
}
