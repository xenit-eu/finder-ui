import { Card, CardHeader, CardText } from "material-ui";
import { Component, createElement as __, DOM as _, FormEvent, ReactElement, CSSProperties } from "react";

import { FieldsetSkeleton_Props_t, FieldSkeleton_Props_t, RenderMode } from "../fields";
import { FieldsetRenderConfig_t, FieldsetRenderer_t } from "./interface";

const cellprops = { style: <CSSProperties>{ width: "50%", overflow: "hidden", wordWrap: "break-word" } };
const tableprops = { style: <CSSProperties>{ width: "100%", tableLayout: "fixed" } };

const CenteredFieldset: FieldsetRenderer_t = (config: FieldsetRenderConfig_t) => {
    return (props: FieldsetSkeleton_Props_t) => {
        return _.table(tableprops,
            props.fields.map(field => _.tr({}, _.td(cellprops, field.label), _.td(cellprops, field.value))),
        );
    };
};
export default CenteredFieldset;
