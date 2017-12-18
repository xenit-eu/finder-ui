import { Card, CardHeader, CardText } from "material-ui";
import { Component, createElement as __, CSSProperties, DOM as _, FormEvent, ReactElement } from "react";

import { FieldsetSkeleton_Props_t, FieldSkeleton_Props_t, RenderMode } from "../fields";
import { FieldsetRenderConfig_t, FieldsetRenderer_t } from "./interface";

const cellpropsleft = { style: <CSSProperties>{ width: "33%", textAlign: "right", overflow: "hidden", textOverflow: "ellipsis" } };
const cellpropsright = { style: <CSSProperties>{ width: "67%" } };
const tableprops = { style: <CSSProperties>{ width: "100%", tableLayout: "fixed" } };

const CenteredFieldset: FieldsetRenderer_t = (config: FieldsetRenderConfig_t) => {
    const component = (props: FieldsetSkeleton_Props_t) => {
        return _.table(tableprops,
            props.fields.map(field => _.tr({}, _.td(cellpropsleft, [field.label]), _.td(cellpropsright, field.value))),
        );
    };
    (<any>component).displayName = "Fieldset.Centered(" + JSON.stringify(config) + ")";
    return component;
};
export default CenteredFieldset;
