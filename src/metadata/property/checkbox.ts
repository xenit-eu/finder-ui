import Checkbox from "material-ui/Checkbox";
import { Component, createElement as __, DOM as _, FormEvent, ReactElement } from "react";

import { FieldSkeleton_Props_t, RenderMode } from "../fields";
import { PropertyRenderConfig_t, PropertyRenderer_t } from "./interface";

const CheckBox: PropertyRenderer_t<boolean> = (config: PropertyRenderConfig_t<boolean>) => {
    return (props: FieldSkeleton_Props_t) => {
        return _.span({ className: "metadata-field" }, __(Checkbox, {
            checked: config.mapToView(props.node),
            onCheck: (evt: FormEvent<{}>, value: boolean) => {
                props.onChange(config.mapToModel(props.node, value));
            },
            disabled: props.renderMode === RenderMode.VIEW,
        }));
    };
};
export default CheckBox;
