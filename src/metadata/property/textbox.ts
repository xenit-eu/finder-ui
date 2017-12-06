import TextField from "material-ui/TextField";
import { Component, createElement as __, DOM as _, FormEvent, ReactElement } from "react";

import { FieldSkeleton_Props_t, RenderMode } from "../fields";
import { PropertyRenderConfig_t, PropertyRenderer_t } from "./interface";

const TextBox: PropertyRenderer_t = (config: PropertyRenderConfig_t) => {
    return (props: FieldSkeleton_Props_t) => {
        return _.span({ className: "metadata-field" }, __(TextField, {
            hintText: "Type value...",
            onChange: (evt: FormEvent<{}>, value: string) => {
                props.onChange(config.mapToModel(props.node, value));
            },
            disabled: props.renderMode !== RenderMode.VIEW,
            floatingLabelText: config.label,
            value: config.mapToView(props.node),
        }));
    };
};
export default TextBox;
