import { action } from "@storybook/addon-actions";
import React, { useState } from "react";
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

const demoFolders = [
    {
        name: "2015-2016",
        type: ExplorerFolderType.FOLDER,
        state: ExplorerFolderState.CLOSED,
    },
    {
        name: "2016-2017",
        type: ExplorerFolderType.FOLDER,
        state: ExplorerFolderState.CLOSED,
    },
];

export const normal = () => <FolderBrowser path={demoPath}
    folders={demoFolders}
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

function FolderBrowserInteractive() {
    const [currentFolderIndex, setCurrentFolderIndex] = useState(2);
    const [isEmptyFolder, setEmptyFolder] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [finalPath, setFinalPath] = useState([]);

    let folders;

    if (isEmptyFolder) {
        folders = [];

    } else if (currentFolderIndex >= demoPath.length) {
        folders = demoFolders.map((f) => ({ ...f, selected: f.name === selectedFolder }));
    } else {
        folders = [{
            ...demoPath[currentFolderIndex],
            state: ExplorerFolderState.CLOSED,
            selected: demoPath[currentFolderIndex].name === selectedFolder,
        }];
    }

    return <FolderBrowser
        path={demoPath.slice(0, currentFolderIndex).concat(finalPath)}
        folders={folders}
        onOpen={(folder) => {
            const inDemoPath = demoPath.findIndex((f) => f.name === folder.name);

            if (inDemoPath > -1) {
                setCurrentFolderIndex(inDemoPath + 1);
                setEmptyFolder(false);
                setFinalPath([]);
            } else {
                setFinalPath([folder]);
                setEmptyFolder(true);
            }
        }}
        onSelect={(folder) => setSelectedFolder(folder.name)}
    />;
}

export const interactive = () => <FolderBrowserInteractive />;

interactive.parameters = {
    storyshots: { disable: true },
};

export const loading = () => <FolderBrowser
    path={demoPath}
    folders={null}
    onOpen={action("open")}
    onSelect={action("select")}
/>;

loading.parameters = {
    storyshots: { disable: true },
};
