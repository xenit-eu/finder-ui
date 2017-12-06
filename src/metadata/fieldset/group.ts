import { Card, CardHeader, CardText } from "material-ui";
import { Component, createElement as __, DOM as _, FormEvent, ReactElement } from "react";

import { FieldsetSkeleton_Props_t, FieldSkeleton_Props_t, RenderMode } from "../fields";
import { FieldsetRenderConfig_t, FieldsetRenderer_t } from "./interface";

const GroupedFieldset: FieldsetRenderer_t = (config: FieldsetRenderConfig_t) => {
    return (props: FieldsetSkeleton_Props_t) => {
        let children = Array.isArray(props.children)?props.children:[props.children];
        return __(Card, {}, [
            __(CardHeader, {expandable: config.expandable, title: config.label, actAsExpander: config.expandable, showExpandableButton: config.expandable}),
            ...children.map(c => __(CardText, { expandable: config.expandable }, c)),
        ]);
    };
};
export default GroupedFieldset;
