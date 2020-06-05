import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import { Theme, withStyles, WithStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import classnames from "classnames";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { OverlayCentered } from "../overlay";
import Overlay from "../overlay/Overlay";
import { FileDropZone } from "../upload";
import useDelayedProp from "../util/hooks/useDelayedProp";
import IconWithText from "../util/IconWithText";
import { ExplorerFolderState, folderIcons, folderStateIcons, IExplorerListFolder } from "./types";

type FolderList_Props_t<T extends IExplorerListFolder> = {
    folders: readonly T[],
    onClick: (folder: T) => void,
    onFilesDropped?: (folder: T, files: readonly File[]) => void,
    folderActions?: (folder: T) => React.ReactNode,
    withRoundedSide?: boolean,
};
export default function FolderList<T extends IExplorerListFolder>(props: FolderList_Props_t<T>) {
    const { folders, ...listProps } = props;
    return <List disablePadding>

        {props.folders.map((folder, i) => <FolderListItem
            key={i}
            folder={folder}
            onClick={props.onClick}
            onFilesDropped={props.onFilesDropped}
            listProps={listProps}
            withRoundedSide={!!props.withRoundedSide}
            actions={props.folderActions && props.folderActions(folder)}
        />)}
    </List>;
}

type FolderListItem_Props_t<T extends IExplorerListFolder> = {
    folder: T,
    withRoundedSide: boolean,
    actions?: React.ReactNode,
    onClick: (folder: T) => void,
    onFilesDropped?: (folder: T, files: readonly File[]) => void,
    listProps: Pick<FolderList_Props_t<T>, Exclude<keyof FolderList_Props_t<T>, "folders">>,
};

const folderListItemStyles = (theme: Theme) => ({
    childList: {
        paddingLeft: theme.spacing.unit * 2,
    },
    selectionIndicator: {
        transition: theme.transitions.create("background-color", {
            duration: theme.transitions.duration.standard,
        }),
    },
    roundedSide: {
        overflow: "hidden",
        borderRadius: "48px 0 0 48px",
    },
    selectedItem: {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.contrastText,
    },
});

function FolderListItem_<T extends IExplorerListFolder>(props: FolderListItem_Props_t<T> & WithStyles<typeof folderListItemStyles>) {
    const onClick = useCallback(() => props.onClick(props.folder), [props.onClick, props.folder]);
    const onFilesDropped = useCallback((files) => props.onFilesDropped!(props.folder, files), [props.onFilesDropped, props.folder]);
    const delayedChildren = useDelayedProp(props.folder.children, 1000, (p) => !!p); // Delay children when they disappear, so collapse can happen smoothly
    return <>
        <FileDropZone
            onFilesDropped={props.onFilesDropped && onFilesDropped}
            className={classnames(props.classes.selectionIndicator, {
                [props.classes.roundedSide]: props.withRoundedSide,
                [props.classes.selectedItem]: props.folder.selected,
            })}
        >{(isDropping: boolean) =>
            <FolderListItemOverlay open={isDropping}>
                <ListItem onClick={onClick} button>
                    <ListItemIcon>
                        {folderStateIcons[props.folder.state] || folderIcons[props.folder.type]}
                    </ListItemIcon>
                    <ListItemText>{props.folder.name}</ListItemText>
                    {props.actions ? <ListItemSecondaryAction>{props.actions}</ListItemSecondaryAction> : null}
                </ListItem>
            </FolderListItemOverlay>
            }</FileDropZone>
        <Collapse in={props.folder.state === ExplorerFolderState.OPEN && !!props.folder.children} unmountOnExit className={props.classes.childList}>
            {delayedChildren ? <FolderList
                folders={delayedChildren}
                {...props.listProps}
                withRoundedSide
            /> : null}
        </Collapse>
    </>;
}

const FolderListItem = withStyles(folderListItemStyles)(FolderListItem_);

type FolderListItemOverlay_Props_t = {
    open: boolean,
    children: React.ReactNode,
};
function FolderListItemOverlay(props: FolderListItemOverlay_Props_t) {
    const { t } = useTranslation("finder-ui");
    return <Overlay {...props} overlay={<OverlayCentered>
        <IconWithText icon={<CloudUploadIcon />} text={t("explorer/FolderList/upload-file-here")} />
    </OverlayCentered>
    } />;
}
