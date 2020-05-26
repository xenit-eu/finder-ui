import React from "react";
import Breadcrumbs from "./Breadcrumbs";

export default {
    title: "breadcrumbs/Breadcrumbs",
    component: Breadcrumbs,
};

export const beneathLimit = () => <Breadcrumbs>
    <span>A</span>
    <span>B</span>
    <span>C</span>
    <span>D</span>
</Breadcrumbs>;

export const onLimit = () => <Breadcrumbs>
    <span>A</span>
    <span>B</span>
    <span>C</span>
    <span>D</span>
    <span>E</span>
</Breadcrumbs>;

export const aboveLimit = () => <Breadcrumbs>
    <span>A</span>
    <span>B</span>
    <span>C</span>
    <span>D</span>
    <span>E</span>
    <span>F</span>
</Breadcrumbs>;

export const withMoreAfterCollapse = () => <Breadcrumbs itemsAfterCollapse={2}>
    <span>A</span>
    <span>B</span>
    <span>C</span>
    <span>D</span>
    <span>E</span>
    <span>F</span>
</Breadcrumbs>;

export const withMoreBeforeCollapse = () => <Breadcrumbs itemsBeforeCollapse={2}>
    <span>A</span>
    <span>B</span>
    <span>C</span>
    <span>D</span>
    <span>E</span>
    <span>F</span>
</Breadcrumbs>;

export const noLimit = () => <Breadcrumbs maxItems={null}>
    <span>A</span>
    <span>B</span>
    <span>C</span>
    <span>D</span>
    <span>E</span>
    <span>F</span>
</Breadcrumbs>;
