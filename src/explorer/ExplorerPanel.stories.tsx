import { action } from "@storybook/addon-actions";
import React, { useState } from "react";
import ExplorerPanel from "./ExplorerPanel";
import { ExplorerFolderState, ExplorerFolderType } from "./types";

export default {
    title: "explorer/ExplorerPanel",
    component: ExplorerPanel,
};

const folders = [
    {
        name: "Company Home",
        type: ExplorerFolderType.HOME,
        state: ExplorerFolderState.CLOSED,
    },
    {
        name: "Shared",
        type: ExplorerFolderType.SHARED,
        state: ExplorerFolderState.CLOSED,
    },
    {
        name: "Legal",
        type: ExplorerFolderType.FOLDER,
        state: ExplorerFolderState.CLOSED,
    },
    {
        name: "Contracts",
        type: ExplorerFolderType.FOLDER,
        state: ExplorerFolderState.CLOSED,
    },
    {
        name: "NDAs",
        type: ExplorerFolderType.FOLDER,
        state: ExplorerFolderState.OPEN,
        children: [
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
        ],
    },
];

export const normal = () => <ExplorerPanel
    onOpen={action("open")}
    onClose={action("close")}
    folders={folders} />;

export const withSearchAction = () => <ExplorerPanel
    onOpen={action("open")}
    onClose={action("close")}
    onSearch={action("search")}
    folders={folders} />;

export const withUploadAction = () => <ExplorerPanel
    onOpen={action("open")}
    onClose={action("close")}
    onUpload={action("upload")}
    onFilesDropped={action("filesDropped")}
    folders={folders} />;

export const withActions = () => <ExplorerPanel
    onOpen={action("open")}
    onClose={action("close")}
    onSearch={action("search")}
    onUpload={action("upload")}
    onFilesDropped={action("filesDropped")}
    folders={folders} />;
