import React, { useCallback } from "react";
import { AutoCollapseBreadcrumbs, ChipBreadcrumb } from "../breadcrumbs";
import { folderIcons, IExplorerFolder } from "./types";

type FolderBreadcrumbs_Props_t<T extends IExplorerFolder> = {
    folders: readonly T[],
    onClick: (folder: T) => void,
};

export default function FolderBreadcrumbs<T extends IExplorerFolder>(props: FolderBreadcrumbs_Props_t<T>) {
    return <AutoCollapseBreadcrumbs itemsBeforeCollapse={{ max: 2 }}>
        {props.folders.map((folder, i) => <FolderBreadcrumbsFolder key={i} folder={folder} onClick={props.onClick} />)}
    </AutoCollapseBreadcrumbs>;
}

type FolderBreadcrumbsFolder_Props_t<T extends IExplorerFolder> = {
    folder: T,
    onClick: (folder: T) => void,
};
function FolderBreadcrumbsFolder<T extends IExplorerFolder>(props: FolderBreadcrumbsFolder_Props_t<T>) {
    const onClick = useCallback(() => props.onClick(props.folder), [props.onClick, props.folder]);
    return <ChipBreadcrumb avatar={folderIcons[props.folder.type]} label={props.folder.name} onClick={onClick} />;
}
