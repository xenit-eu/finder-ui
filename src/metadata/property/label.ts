import { Component, createElement as __, DOM as _, FormEvent, ReactElement } from "react";

import { FieldSkeleton_Props_t, RenderMode } from "../fields";
import { PropertyRenderConfig_t, PropertyRenderer_t } from "./interface";

const Label: PropertyRenderer_t<string> = (config: PropertyRenderConfig_t<string>) => {
    return (props: FieldSkeleton_Props_t) => {
        return _.span({ className: "metadata-value" }, config.mapToView(props.node));
    };
};
export default Label;
