import { action } from "@storybook/addon-actions";
import React from "react";
import FolderBreadcrumbs from "./FolderBreadcrumbs";
import { ExplorerFolderType } from "./types";

export default {
    title: "explorer/FolderBreadcrumbs",
    component: FolderBreadcrumbs,
};

export const normal = () => <FolderBreadcrumbs onClick={action("click")} folders={[
    {
        name: "Company Home",
        type: ExplorerFolderType.HOME,
    },
    {
        name: "Shared",
        type: ExplorerFolderType.SHARED,
    },
    {
        name: "Legal",
        type: ExplorerFolderType.FOLDER,
    },
    {
        name: "Contracts",
        type: ExplorerFolderType.FOLDER,
    },
    {
        name: "NDAs",
        type: ExplorerFolderType.FOLDER,
    },
    {
        name: "2016-2017",
        type: ExplorerFolderType.FOLDER,
    },
]} />;
