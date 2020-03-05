import TextField from "material-ui/TextField";
import { Component, createElement as __, FormEvent } from "react";
import * as _ from "react-dom-factories";

import { FieldSkeleton_Props_t, RenderMode } from "../fields";
import { ChangeOnBlurTextField } from "./helpers";
import { PropertyRenderConfig_t, PropertyRenderer_t } from "./interface";
import Label from "./label";

const TextArea: PropertyRenderer_t<string | string[]> = (config: PropertyRenderConfig_t<string | string[]>) => {
    const label = Label(config);
    // tslint:disable-next-line:only-arrow-functions
    return function TextArea(props: FieldSkeleton_Props_t) {
        const value = config.mapToView(props.node);
        const isMultiValue = Array.isArray(value);
        const stringValue = Array.isArray(value) ? value.join(", ") : value;
        if (props.renderMode !== RenderMode.VIEW) {
            if (!isMultiValue) {
                return _.span({ className: "metadata-field metadata-field-textarea" }, __(ChangeOnBlurTextField, {
                    fullWidth: true,
                    hintText: "Type value...",
                    onChange: (evt: FormEvent<{}>, v: string) => {
                        props.onChange(config.mapToModel(props.node, v));
                    },
                    multiLine: true,
                    rows: 2,
                    rowsMax: 4,
                    value: <string> value,
                }));
            } else {
                // TODO: Implement handling of multivalue fields
                return null;
            }
        } else {
            return __(label, <any> { ...props, className: "metadata-value metadata-field-textarea" });
        }
    };
};
export default TextArea;
