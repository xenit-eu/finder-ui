import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import { Theme, withStyles, WithStyles } from "@material-ui/core/styles";
import classnames from "classnames";
import React, { useCallback } from "react";
import { ExplorerFolderState, folderIcons, folderStateIcons, IExplorerListFolder } from "./types";

type FolderList_Props_t<T extends IExplorerListFolder> = {
    folders: readonly T[],
    onClick: (folder: T) => void,
    folderActions?: (folder: T) => React.ReactNode,
};
export default function FolderList<T extends IExplorerListFolder>(props: FolderList_Props_t<T>) {
    const { folders, ...listProps } = props;
    return <List disablePadding>

        {props.folders.map((folder, i) => <FolderListItem
            key={i}
            folder={folder}
            onClick={props.onClick}
            listProps={listProps}
            actions={props.folderActions && props.folderActions(folder)}
        />)}
    </List>;
}

type FolderListItem_Props_t<T extends IExplorerListFolder> = {
    folder: T,
    actions?: React.ReactNode,
    onClick: (folder: T) => void,
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
    selectedItem: {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.contrastText,
    },
});

function FolderListItem_<T extends IExplorerListFolder>(props: FolderListItem_Props_t<T> & WithStyles<typeof folderListItemStyles>) {
    const onClick = useCallback(() => props.onClick(props.folder), [props.onClick, props.folder]);
    return <>
        <div className={classnames(props.classes.selectionIndicator, {
            [props.classes.selectedItem]: props.folder.selected,
        })}>
            <ListItem onClick={onClick} button>
                <ListItemIcon>
                    {folderStateIcons[props.folder.state] || folderIcons[props.folder.type]}
                </ListItemIcon>
                <ListItemText>{props.folder.name}</ListItemText>
                {props.actions ? <ListItemSecondaryAction>{props.actions}</ListItemSecondaryAction> : null}
            </ListItem>
        </div>
        <Collapse in={props.folder.state === ExplorerFolderState.OPEN} unmountOnExit className={props.classes.childList}>
            {props.folder.children ? <FolderList
                folders={props.folder.children}
                {...props.listProps}
            /> : null}
        </Collapse>
    </>;
}

const FolderListItem = withStyles(folderListItemStyles)(FolderListItem_);
