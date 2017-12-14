import Checkbox from "material-ui/Checkbox";
import { Component, createElement as __, DOM as _, FormEvent, ReactElement } from "react";

import { FieldSkeleton_Props_t, RenderMode } from "../fields";
import { PropertyRenderConfig_t, PropertyRenderer_t } from "./interface";

const CheckBox: PropertyRenderer_t<boolean | boolean[]> = (config: PropertyRenderConfig_t<boolean | boolean[]>) => {
    // tslint:disable-next-line:only-arrow-functions
    return function CheckBox(props: FieldSkeleton_Props_t) {
        const value = config.mapToView(props.node);
        const isMultiValue = Array.isArray(value);
        if (!isMultiValue) {
            return _.span({ className: "metadata-field" }, __(Checkbox, {
                checked: <boolean>value,
                onCheck: (evt: FormEvent<{}>, v: boolean) => {
                    props.onChange(config.mapToModel(props.node, v));
                },
                disabled: props.renderMode === RenderMode.VIEW,
            }));
        } else {
            // TODO: Implement handling of multivalue fields
            return null;
        }
    };
};
export default CheckBox;
