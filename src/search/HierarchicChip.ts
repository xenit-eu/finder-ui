
import * as keycode from "keycode";
import CancelIcon from "material-ui/svg-icons/navigation/cancel";
import { Component, createElement as __, ReactElement } from "react";
import * as _ from "react-dom-factories";
import "./HierarchicChip.less";

export interface HierarchicChipProps {
    label: string;
    children: ReactElement<any>[];
    onDelete?: (event: any) => void;
    onClick?: (event: any) => void;
    onKeyDown?: (event: any) => void;
    key: string;
}
export class HierarchicChip extends Component<HierarchicChipProps, {}> {
    public colors = {
        background: "#0002",
        deleteIcon: "#888",
        deleteIconHover: "#FFF",

    };

    public handleDeleteIconClick(event: any) {
        // Stop the event from bubbling up to the `Chip`
        event.stopPropagation();
        const { onDelete } = this.props;
        if (onDelete) {
            onDelete(event);
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

    public render() {
        const childrenInterleaved: Array<any> = [];
        this.props.children.forEach((c, i) => {
            childrenInterleaved.push(c);
            if (i < this.props.children.length - 1) {
                childrenInterleaved.push(_.text({ style: { margin: "2px" }, key: "inter" + i }, this.props.label));
            }
        });
        return _.div({
            className: "hierarchic-chip",
            key: this.props.key,
        }, childrenInterleaved, __(CancelIcon, {
            color: "#000A",
            className: "cancel-icon",
            onClick: (event: any) => this.handleDeleteIconClick(event),

        }));
    }
}
