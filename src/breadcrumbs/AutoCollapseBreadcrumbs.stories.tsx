import React from "react";
import AutoCollapseBreadcrumbs from "./AutoCollapseBreadcrumbs";

export default {
    title: "breadcrumbs/AutoCollapseBreadcrumbs",
    component: AutoCollapseBreadcrumbs,
};

export const aboveLimit = () => <AutoCollapseBreadcrumbs>
    <span>AAAAAAAA</span>
    <span>BBBBBBBB</span>
    <span>CCCCCCCC</span>
    <span>DDDDDDDD</span>
    <span>EEEEEEEE</span>
    <span>FFFFFFFF</span>
    <span>GGGGGGGG</span>
    <span>HHHHHHHH</span>
</AutoCollapseBreadcrumbs>;
