import React from "react";
import AutoCollapseBreadcrumbs from "./AutoCollapseBreadcrumbs";

export default {
    title: "breadcrumbs/AutoCollapseBreadcrumbs",
    component: AutoCollapseBreadcrumbs,
};

const configuredWidths = [200, 300, 400, 500, 600, 700, 800];

function createElements(elem) {
    return <div>
        {configuredWidths.map((width) =>
            <div style={{ width, outline: "1px dotted hotpink", marginBottom: 20 }} key={width}>
                {elem}
            </div>,
        )}
    </div>;
}

export const normal = () => createElements(<AutoCollapseBreadcrumbs>
    <span>AAAAAAAA</span>
    <span>BBBBBBBB</span>
    <span>CCCCCCCC</span>
    <span>DDDDDDDD</span>
    <span>EEEEEEEE</span>
    <span>FFFFFFFF</span>
    <span>GGGGGGGG</span>
    <span>HHHHHHHH</span>
</AutoCollapseBreadcrumbs>,
);

export const fixedBeforeCollapse = () => createElements(
    <AutoCollapseBreadcrumbs itemsBeforeCollapse={1}>
        <span>AAAAAAAA</span>
        <span>BBBBBBBB</span>
        <span>CCCCCCCC</span>
        <span>DDDDDDDD</span>
        <span>EEEEEEEE</span>
        <span>FFFFFFFF</span>
        <span>GGGGGGGG</span>
        <span>HHHHHHHH</span>
    </AutoCollapseBreadcrumbs>,
);

export const rangedBeforeCollapse = () => createElements(
    <AutoCollapseBreadcrumbs itemsBeforeCollapse={{ min: 1, max: 2 }}>
        <span>AAAAAAAA</span>
        <span>BBBBBBBB</span>
        <span>CCCCCCCC</span>
        <span>DDDDDDDD</span>
        <span>EEEEEEEE</span>
        <span>FFFFFFFF</span>
        <span>GGGGGGGG</span>
        <span>HHHHHHHH</span>
    </AutoCollapseBreadcrumbs>,
);

export const fixedAfterCollapse = () => createElements(
    <AutoCollapseBreadcrumbs itemsAfterCollapse={1}>
        <span>AAAAAAAA</span>
        <span>BBBBBBBB</span>
        <span>CCCCCCCC</span>
        <span>DDDDDDDD</span>
        <span>EEEEEEEE</span>
        <span>FFFFFFFF</span>
        <span>GGGGGGGG</span>
        <span>HHHHHHHH</span>
    </AutoCollapseBreadcrumbs>,
);

export const rangedAfterCollapse = () => createElements(
    <AutoCollapseBreadcrumbs itemsAfterCollapse={{ min: 1, max: 2 }}>
        <span>AAAAAAAA</span>
        <span>BBBBBBBB</span>
        <span>CCCCCCCC</span>
        <span>DDDDDDDD</span>
        <span>EEEEEEEE</span>
        <span>FFFFFFFF</span>
        <span>GGGGGGGG</span>
        <span>HHHHHHHH</span>
    </AutoCollapseBreadcrumbs>,
);
