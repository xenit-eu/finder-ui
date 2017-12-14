import TextField from "material-ui/TextField";
import { Component, createElement as __, DOM as _, FormEvent, ReactElement } from "react";

import { FieldSkeleton_Props_t, RenderMode } from "../fields";
import { PropertyRenderConfig_t, PropertyRenderer_t } from "./interface";

const TextBox: PropertyRenderer_t<string | string[]> = (config: PropertyRenderConfig_t<string | string[]>) => {
    // tslint:disable-next-line:only-arrow-functions
    return function TextBox(props: FieldSkeleton_Props_t) {
        const value = config.mapToView(props.node);
        const isMultiValue = Array.isArray(value);
        const stringValue = isMultiValue ? value.join(", ") : value;
        if (props.renderMode !== RenderMode.VIEW) {
            if(!isMultiValue) {
                return _.span({ className: "metadata-field" }, __(TextField, {
                    fullWidth: true,
                    hintText: "Type value...",
                    onChange: (evt: FormEvent<{}>, v: string) => {
                        props.onChange(config.mapToModel(props.node, v));
                    },
                    value: <string>value,
                }));
            } else {
                // TODO: Implement handling of multivalue fields
                return null;
            }
        } else {
            return _.span({ className: "metadata-value" }, [stringValue]);
        }
    };
};
export default TextBox;
