import TextField from "material-ui/TextField";
import { Component, createElement as __, DOM as _, FormEvent, ReactElement } from "react";

import { FieldSkeleton_Props_t, RenderMode } from "../fields";
import { PropertyRenderConfig_t, PropertyRenderer_t } from "./interface";

const TextBox: PropertyRenderer_t<string> = (config: PropertyRenderConfig_t<string>) => {
    // tslint:disable-next-line:only-arrow-functions
    return function TextBox(props: FieldSkeleton_Props_t) {
        if (props.renderMode !== RenderMode.VIEW) {
            return _.span({ className: "metadata-field" }, __(TextField, {
                fullWidth: true,
                hintText: "Type value...",
                onChange: (evt: FormEvent<{}>, value: string) => {
                    props.onChange(config.mapToModel(props.node, value));
                },
                value: config.mapToView(props.node),
            }));
        } else {
            return _.span({ className: "metadata-value" }, config.mapToView(props.node));
        }
    };
};
export default TextBox;
