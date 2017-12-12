import TextField from "material-ui/TextField";
import { Component, createElement as __, DOM as _, FormEvent, ReactElement } from "react";

import { FieldSkeleton_Props_t, RenderMode } from "../fields";
import { PropertyRenderConfig_t, PropertyRenderer_t } from "./interface";

const TextArea: PropertyRenderer_t<string> = (config: PropertyRenderConfig_t<string>) => {
    return (props: FieldSkeleton_Props_t) => {
        if (props.renderMode !== RenderMode.VIEW) {
            return _.span({ className: "metadata-field" }, __(TextField, {
                fullWidth: true,
                hintText: "Type value...",
                onChange: (evt: FormEvent<{}>, value: string) => {
                    props.onChange(config.mapToModel(props.node, value));
                },
                multiLine: true,
                rows: 2,
                rowsMax: 4,
                value: config.mapToView(props.node),
            }));
        } else {
            return _.span({ className: "metadata-value" }, config.mapToView(props.node));
        }
    };
};
export default TextArea;
