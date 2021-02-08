import IconButton from "@material-ui/core/IconButton";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { action } from "@storybook/addon-actions";
import React, { useReducer, useState } from "react";
import { v4 as uuid } from "uuid";
import FolderList from "./FolderList";
import { ExplorerFolderState, ExplorerFolderType } from "./types";

export default {
    title: "explorer/FolderList",
    component: FolderList,
};

export const withoutActions = () => <FolderList
    onClick={action("click")}
    onFilesDropped={action("filesDropped")}
    folders={[
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
    ]} />;

export const withActions = () => <FolderList
    onClick={action("click")}
    onFilesDropped={action("filesDropped")}
    folders={[
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
    ]}
    folderActions={(folder) => <><IconButton><MoreVertIcon /></IconButton></>}
/>;

export const selected = () => <FolderList
    onClick={action("click")}
    onFilesDropped={action("filesDropped")}
    folders={[
        {
            name: "NDAs",
            type: ExplorerFolderType.FOLDER,
            state: ExplorerFolderState.OPEN,
            children: [
                {
                    name: "2015-2016",
                    type: ExplorerFolderType.FOLDER,
                    state: ExplorerFolderState.CLOSED,
                    selected: true,
                },
                {
                    name: "2016-2017",
                    type: ExplorerFolderType.FOLDER,
                    state: ExplorerFolderState.LOADING,
                },
            ],
        },
    ]}
/>;

const folders = {
    id: uuid(),
    name: "Company Home",
    type: ExplorerFolderType.HOME,
    children: [
        {
            id: uuid(),
            name: "Shared",
            type: ExplorerFolderType.SHARED,
            children: [
                {
                    id: uuid(),
                    name: "Engineering",
                    type: ExplorerFolderType.FOLDER,
                },
                {
                    id: uuid(),
                    name: "Legal",
                    type: ExplorerFolderType.FOLDER,
                    children: [

                        {
                            id: uuid(),
                            name: "Contracts",
                            type: ExplorerFolderType.FOLDER,
                            children: [

                                {
                                    id: uuid(),
                                    name: "NDAs",
                                    type: ExplorerFolderType.FOLDER,
                                    children: [
                                        {
                                            id: uuid(),
                                            name: "2015-2016",
                                            type: ExplorerFolderType.FOLDER,
                                        },
                                        {
                                            id: uuid(),
                                            name: "2016-2017",
                                            type: ExplorerFolderType.FOLDER,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },

            ],
        },
    ],
};
function InteractiveFolderList() {
    const [loadedFolders, addLoadedFolder] = useReducer((state, action) => {
        return { ...state, [action]: true };
    }, {});
    const [folderStates, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case "toggle":
                if (state[action.id] === undefined || state[action.id] === ExplorerFolderState.CLOSED) {
                    if (!loadedFolders[action.id]) {
                        setTimeout(() => { dispatch({ type: "loaded", id: action.id }); }, 1000);
                        return {
                            ...state,
                            [action.id]: ExplorerFolderState.LOADING,
                        };
                    } else {
                        return {
                            ...state,
                            [action.id]: ExplorerFolderState.OPEN,
                        };
                    }
                } else {
                    return {
                        ...state,
                        [action.id]: ExplorerFolderState.CLOSED,
                    };
                }
            case "loaded":
                addLoadedFolder(action.id);
                if (state[action.id] === ExplorerFolderState.LOADING) {
                    return {
                        ...state,
                        [action.id]: ExplorerFolderState.OPEN,
                    };
                }
                return state;
                break;
            default:
                throw new Error();
        }
    }, {});
    const [selectedFolder, setSelectedFolder] = useState(null);

    function updateFolders(folder) {
        const state = folderStates[folder.id] || ExplorerFolderState.CLOSED;
        return {
            ...folder,
            state,
            selected: folder.id === selectedFolder,
            children: folder.children && folder.children.map((c) => updateFolders(c)),
        };
    }

    return <FolderList
        folders={[updateFolders(folders)]}
        onClick={(folder) => dispatch({ type: "toggle", id: folder.id })}
        folderActions={(folder) => <IconButton onClick={() => setSelectedFolder(folder.id)}>
            <ArrowForwardIcon />
        </IconButton>}
    />;
}

export const interactive = () => <InteractiveFolderList />;

interactive.parameters = {
    storyshots: { disable: true },
};
