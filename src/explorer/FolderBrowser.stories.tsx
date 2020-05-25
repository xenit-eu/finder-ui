import { action } from "@storybook/addon-actions";
import React from "react";
import FolderBrowser from "./FolderBrowser";
import { ExplorerFolderState, ExplorerFolderType } from "./types";

export default {
    title: "explorer/FolderBrowser",
    component: FolderBrowser,
};

const demoPath = [
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
];

export const normal = () => <FolderBrowser path={demoPath}
    folders={[
        {
            name: "2015-2016",
            type: ExplorerFolderType.FOLDER,
            state: ExplorerFolderState.CLOSED,
        },
        {
            name: "2016-2017",
            type: ExplorerFolderType.FOLDER,
            state: ExplorerFolderState.LOADING,
        },
    ]}
    onOpen={action("open")}
    onSelect={action("select")}
/>;

export const withSelectedItem = () => <FolderBrowser
    path={demoPath}
    folders={[
        {
            name: "2015-2016",
            type: ExplorerFolderType.FOLDER,
            state: ExplorerFolderState.CLOSED,
        },
        {
            name: "2016-2017",
            type: ExplorerFolderType.FOLDER,
            state: ExplorerFolderState.CLOSED,
            selected: true,
        },
    ]}
    onOpen={action("open")}
    onSelect={action("select")}
/>;

export const empty = () => <FolderBrowser path={demoPath}
    folders={[]}
    onOpen={action("open")}
    onSelect={action("select")}
/>;
