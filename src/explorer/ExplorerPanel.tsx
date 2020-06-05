import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import SearchIcon from "@material-ui/icons/Search";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import invariant from "tiny-invariant";
import { IOverflowMenuItem, OverflowMenu } from "../menu";
import FolderList from "./FolderList";
import { ExplorerFolderState, IExplorerListFolder } from "./types";

type ExplorerPanel_Props_t<T extends IExplorerListFolder> = {
    folders: readonly T[],
    onOpen: (folder: T) => void,
    onClose: (folder: T) => void,
    onSearch?: (folder: T) => void,
    onUpload?: (folder: T) => void,
    onFilesDropped?: (folder: T, files: readonly File[]) => void,
};

export default function ExplorerPanel<T extends IExplorerListFolder>(props: ExplorerPanel_Props_t<T>) {
    const onClick = useCallback((folder: T) => {
        switch (folder.state) {
            case ExplorerFolderState.CLOSED:
                props.onOpen(folder);
                break;
            case ExplorerFolderState.OPEN:
            case ExplorerFolderState.LOADING: // A folder can only be loading when it is being opened
                props.onClose(folder);
                break;
            default:
                invariant(false, "Impossible folder.state reached");
        }
    }, [props.onOpen, props.onClose]);

    return <FolderList
        onClick={onClick}
        folders={props.folders}
        onFilesDropped={props.onFilesDropped}
        folderActions={(folder) => <ExplorerPanelMenu {...props} folder={folder} />}
    />;

}

type ExplorerPanelMenu_Props_t<T extends IExplorerListFolder> = ExplorerPanel_Props_t<T> & {
    folder: T,
};
function ExplorerPanelMenu<T extends IExplorerListFolder>({ folder, ...props }: ExplorerPanelMenu_Props_t<T>) {
    const { t } = useTranslation("finder-ui");

    const onSearch = useCallback(() => props.onSearch!(folder), [props.onSearch, folder]);
    const onUpload = useCallback(() => props.onUpload!(folder), [props.onUpload, folder]);

    const actions: IOverflowMenuItem[] = [];
    if (props.onSearch) {
        actions.push({
            icon: <SearchIcon />,
            label: t("explorer/ExplorerPanel/search-folder"),
            onClick: onSearch,
        });
    }

    if (props.onUpload) {
        actions.push({
            icon: <CloudUploadIcon />,
            label: t("explorer/ExplorerPanel/upload-file-here"),
            onClick: onUpload,
        });
    }

    return <OverflowMenu maxItems={1} items={actions} />;
}
