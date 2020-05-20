import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import React from "react";
import BreadcrumbsBase from "./BreadcrumbsBase";

export default {
    title: "breadcrumbs/BreadcrumbsBase",
    component: BreadcrumbsBase,
};

function Wrapper({ children }) {
    return <div style={{ outline: "1px solid red" }}>
        {children}
    </div>;
}

export const withText = () => <Wrapper><BreadcrumbsBase children={["a", "b", "c"]} /></Wrapper>;

export const withComponents = () => <Wrapper><BreadcrumbsBase>
    <span>A</span>
    <span>B</span>
    <span style={{ color: "red" }}>C</span>
</BreadcrumbsBase></Wrapper>;

export const withIconSeparator = () => <Wrapper>
    <BreadcrumbsBase separator={<NavigateNextIcon fontSize="inherit" />}>
        <span>A</span>
        <span>B</span>
        <span>C</span>
    </BreadcrumbsBase>
</Wrapper>;

export const empty = () => <Wrapper><BreadcrumbsBase /></Wrapper>;
