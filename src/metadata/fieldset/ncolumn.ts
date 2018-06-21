import { Card, CardHeader, CardText } from "material-ui";
import { Component, createElement as __, CSSProperties, FormEvent, ReactElement } from "react";
import * as _ from "react-dom-factories";

import { FieldsetSkeleton_Props_t, FieldSkeleton_Props_t, RenderMode } from "../fields";
import { FieldsetRenderConfig_t, FieldsetRenderer_t } from "./interface";

import "./ncolumn.less";

const NColumn: (ncolumns: number) => FieldsetRenderer_t = (ncolumns: number) => {
    return (config: FieldsetRenderConfig_t) => {
        const component = (props: FieldsetSkeleton_Props_t) => {
            return _.div({ className: "metadata-fieldset metadata-fieldset-columns metadata-fieldset-" + ncolumns + "-column" },
                config.label ? _.div({ className: "metadata-fieldset-title" }, config.label) : undefined,
                props.fields.map(field => _.div({ className: "metadata-fieldset-field" }, [
                    field.label ? _.span({ className: "metadata-fieldset-label" }, field.label) : undefined,
                    _.span({ className: "metadata-fieldset-value" }, field.value),
                ])),
            );
        };
        (<any>component).displayName = "Fieldset.NColumn(" + ncolumns + ")(" + JSON.stringify(config) + ")";
        return component;
    };
};

export default NColumn;
