import React from "react";
import AutosizeBreadcrumbs from "./AutosizeBreadcrumbs";

export default {
    title: "breadcrumbs/AutosizeBreadcrumbs",
    component: AutosizeBreadcrumbs,
};

export const aboveLimit = () => <AutosizeBreadcrumbs>
    <span>AAAAAAAA</span>
    <span>BBBBBBBB</span>
    <span>CCCCCCCC</span>
    <span>DDDDDDDD</span>
    <span>EEEEEEEE</span>
    <span>FFFFFFFF</span>
    <span>GGGGGGGG</span>
    <span>HHHHHHHH</span>
</AutosizeBreadcrumbs>;
