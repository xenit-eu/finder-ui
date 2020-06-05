import HomeIcon from "@material-ui/icons/Home";
import React from "react";
import ChipBreadcrumb from "./ChipBreadcrumb";

export default {
    title: "breadcrumbs/ChipBreadcrumb",
    component: ChipBreadcrumb,
};

export const withText = () => <ChipBreadcrumb label="Hello" />;

export const withAvatar = () => <ChipBreadcrumb label="Hello" avatar={<HomeIcon />} />;

export const clickable = () => <ChipBreadcrumb label="Hello" clickable />;
