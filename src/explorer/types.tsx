import FolderIcon from "@material-ui/icons/Folder";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import FolderSharedIcon from "@material-ui/icons/FolderShared";
import HomeIcon from "@material-ui/icons/Home";
import LoopIcon from "@material-ui/icons/Loop";
import React from "react";
export interface IExplorerFolder {
    readonly name: string;
    readonly type: ExplorerFolderType;
}

export enum ExplorerFolderType {
    HOME,
    FOLDER,
    SHARED,
}

// @internal
export const folderIcons = {
    [ExplorerFolderType.HOME]: <HomeIcon />,
    [ExplorerFolderType.FOLDER]: <FolderIcon />,
    [ExplorerFolderType.SHARED]: <FolderSharedIcon />,
};

export enum ExplorerFolderState {
    CLOSED,
    OPEN,
    LOADING,
}

export interface IExplorerListFolder extends IExplorerFolder {
    readonly state: ExplorerFolderState;
    readonly selected: boolean;
    readonly children?: readonly IExplorerListFolder[];
}

// @internal
export const folderStateIcons = {
    [ExplorerFolderState.OPEN]: <FolderOpenIcon />,
    [ExplorerFolderState.LOADING]: <LoopIcon />,
};
