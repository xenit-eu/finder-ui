import { Card, CardHeader, CardText } from "material-ui";
import { Component, createElement as __, FormEvent, ReactElement } from "react";
import * as _ from "react-dom-factories";

import { FieldsetSkeleton_Props_t, FieldSkeleton_Props_t, RenderMode } from "../fields";
import Centered from "./centered";
import { FieldsetRenderConfig_t, FieldsetRenderer_t } from "./interface";
import ncolumns from "./ncolumn";

const GroupedFieldset: FieldsetRenderer_t = (config: FieldsetRenderConfig_t) => {
    const wrappedrenderer = config.parameters.centered ? Centered(config) : ncolumns(1)(config);
    const expandable = !!config.parameters.collapsible;
    const component = (props: FieldsetSkeleton_Props_t) => {
        return __(Card, {
            initiallyExpanded: !config.parameters["start-collapsed"],
            className: "metadata-fieldset metadata-fieldset-group metadata-fieldset-group-" + (expandable ? "expandable" : "fixed"),
        },
            __(CardHeader, {
                title: config.label,
                actAsExpander: expandable,
                showExpandableButton: expandable,
                className: "metadata-fieldset-title",
            }),
            __(CardText, {
                expandable,
                className: "metadata-fieldset-body",
            }, __(wrappedrenderer, props)),
        );
    };
    (<any> component).displayName = "Fieldset.Group(" + JSON.stringify(config) + ")";
    return component;
};
export default GroupedFieldset;
