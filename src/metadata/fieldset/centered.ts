import { Card, CardHeader, CardText } from "material-ui";
import { Component, createElement as __, CSSProperties, DOM as _, FormEvent, ReactElement } from "react";

import { FieldsetSkeleton_Props_t, FieldSkeleton_Props_t, RenderMode } from "../fields";
import { FieldsetRenderConfig_t, FieldsetRenderer_t } from "./interface";

import "./centered.less";

const CenteredFieldset: FieldsetRenderer_t = (config: FieldsetRenderConfig_t) => {
    const component = (props: FieldsetSkeleton_Props_t) => {
        return _.table({ className: "metadata-fieldset metadata-fieldset-centered" },
            config.label ? _.div({ className: "metadata-fieldset-title" }, config.label) : undefined,
            props.fields.map(field => _.tr({ className: "metadata-fieldset-field" },
                field.label ? _.td({ className: "metadata-fieldset-label" }, [field.label]) : undefined,
                _.td({ className: "metadata-fieldset-value", colSpan: field.label ? 1 : 2 }, field.value),
            )),
        );
    };
    (<any>component).displayName = "Fieldset.Centered(" + JSON.stringify(config) + ")";
    return component;
};
export default CenteredFieldset;
