import { Card, CardHeader, CardText } from "material-ui";
import { Component, createElement as __, DOM as _, FormEvent, ReactElement } from "react";

import { FieldsetSkeleton_Props_t, FieldSkeleton_Props_t, RenderMode } from "../fields";
import Centered from "./centered";
import { FieldsetRenderConfig_t, FieldsetRenderer_t } from "./interface";

const GroupedFieldset: FieldsetRenderer_t = (config: FieldsetRenderConfig_t) => {
    const centered = Centered(config);
    return (props: FieldsetSkeleton_Props_t) => {
        const expandable = !!config.parameters['collapsible'];
        return __(Card, { initiallyExpanded: !config.parameters['start-collapsed'] }, [
            __(CardHeader, { title: config.label, actAsExpander: expandable, showExpandableButton: expandable}),
            __(CardText, {
                expandable,
            }, __(centered, props)),
        ]);
    };
};
export default GroupedFieldset;
