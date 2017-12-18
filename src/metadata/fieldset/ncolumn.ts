import { Card, CardHeader, CardText } from "material-ui";
import { Component, createElement as __, CSSProperties, DOM as _, FormEvent, ReactElement } from "react";

import { FieldsetSkeleton_Props_t, FieldSkeleton_Props_t, RenderMode } from "../fields";
import { FieldsetRenderConfig_t, FieldsetRenderer_t } from "./interface";

const NColumn: (ncolumns: number) => FieldsetRenderer_t = (ncolumns: number) => {
    const columnProps = { style: <CSSProperties>{ width: (100 / ncolumns) + "%", display: "inline-block" } };
    return (config: FieldsetRenderConfig_t) => {
        const component = (props: FieldsetSkeleton_Props_t) => {
            return _.div({},
                props.fields.map(field => _.div(columnProps, [field.label, "\u2003", field.value])),
            );
        };
        (<any>component).displayName = "Fieldset.NColumn(" + ncolumns + ")(" + JSON.stringify(config) + ")";
        return component;
    };
};

export default NColumn;
