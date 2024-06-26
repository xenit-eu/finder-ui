import ld from "lodash";
import { Component, createElement as __, FormEvent, ReactElement } from "react";
import * as _ from "react-dom-factories";

import { FieldSkeleton_Props_t, RenderMode } from "../fields";
import { PropertyRenderConfig_t, PropertyRenderer_t } from "./interface";
import FontIcon from "material-ui/FontIcon";

type KV_t = {
    key: string,
    value: string,
};

type Label_State_t = {
    currentValues: KV_t[],
    currentValuesLoaded: boolean,
};
const Label: PropertyRenderer_t<string | string[]> = (config: PropertyRenderConfig_t<string | string[]>) => {
    class LabelInner extends Component<FieldSkeleton_Props_t & { className?: string }, Label_State_t> {
        constructor(props: FieldSkeleton_Props_t & { className?: string }) {
            super(props);
            this.state = {
                currentValues: [],
                currentValuesLoaded: false,
            };
        }

        private _getViewValue(): string[] {
            const value = config.mapToView(this.props.node);
            return Array.isArray(value) ? value : [value];
        }

        private lookupCurrentValues() {
            this.setState({ currentValuesLoaded: false }, () => {
                if (config.parameters.resolver) {
                    config.parameters.resolver.lookup(this._getViewValue().map((v) => v.toString()))
                        .then((items: KV_t[]) => this.setState({ currentValues: items, currentValuesLoaded: true }));
                } else {
                    this.setState({ currentValues: this._getViewValue().map((v) => ({ key: v, value: v })), currentValuesLoaded: true });
                }
            });
        }

        public componentDidMount() {
            this.lookupCurrentValues();
        }

        public componentWillReceiveProps(nextProps: FieldSkeleton_Props_t) {
            if (!ld.isEqual(nextProps.node, this.props.node)) {
                this.lookupCurrentValues();
            }
        }

        public render() {
            const classNamed = { className: this.props.className || "metadata-value metadata-field-label" };
            if (!this.state.currentValuesLoaded) {
                return _.span(classNamed, "Loading...");
            }
            const pattern = config.parameters["string-pattern"];
            const format = config.parameters["string-format"];
            const values = (pattern && format)
                ? this.state.currentValues.map((item) => item.value.replace(new RegExp(pattern), format))
                : this.state.currentValues.map((item) => item.value);
            const value = values.join(", ");
            if (value.startsWith("icon-")) {
                const iconProps = this.getIconProps(value.substring(5));
                return _.div({title: iconProps.title}, __(FontIcon, {
                    className: iconProps.classNames,
                }));
            }
            return _.span({ ...classNamed, title: value }, value);
        }

        private getIconProps(mimetype: string): {classNames: string, title: string} {
            if (mimetype === "application/pdf") {
                return {classNames: `fa fa-file-pdf-o`, title: "PDF"};
            }
            if (mimetype.startsWith("text/")) {
                return {classNames: `fa fa-file-text-o`, title: "TEXT"};
            }
            if (mimetype.startsWith("image/")) {
                return {classNames: `fa fa-file-image-o`, title: "IMAGE"};
            }
            if (mimetype === "message/rfc822") {
                return {classNames: `fa fa-envelope-o`, title: "EMAIL"};
            }
            return {classNames: `fa fa-file-o`, title: "other file"};
        }

    }
    return LabelInner;
};
export default Label;
