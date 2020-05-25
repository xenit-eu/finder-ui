import React, { useCallback } from "react";
import { Breadcrumbs, ChipBreadcrumb } from "../breadcrumbs";
import { folderIcons, IExplorerFolder } from "./types";

type FolderBreadcrumbs_Props_t<T extends IExplorerFolder> = {
    folders: readonly T[],
    onSelect: (folder: T) => void,
};

export default function FolderBreadcrumbs<T extends IExplorerFolder>(props: FolderBreadcrumbs_Props_t<T>) {
    return <Breadcrumbs>
        {props.folders.map((folder, i) => <FolderBreadcrumbsFolder key={i} folder={folder} onSelect={props.onSelect} />)}
    </Breadcrumbs>;
}

type FolderBreadcrumbsFolder_Props_t<T extends IExplorerFolder> = {
    folder: T,
    onSelect: (folder: T) => void,
};
function FolderBreadcrumbsFolder<T extends IExplorerFolder>({ folder, onSelect }: FolderBreadcrumbsFolder_Props_t<T>) {
    const onClick = useCallback(() => onSelect(folder), [onSelect, folder]);
    return <ChipBreadcrumb avatar={folderIcons[folder.type]} label={folder.name} onClick={onClick} />;
}
