import { List, ListItem } from "@material-ui/core";
import { Theme, WithStyles, withStyles } from "@material-ui/core/styles";
import classnames from "classnames";
import * as React from "react";
import UploadedFile from "./UploadedFile";

export interface IUploadedFile {
    readonly fileName: string;
    readonly progress: number;
    readonly errorMessage?: string;
    readonly selected?: boolean;
};

export type UploadList_Props_t<T extends IUploadedFile = IUploadedFile> = {
    files: readonly T[];
    onUploadClick: (file: T) => void,
    onUploadCancel: (file: T) => void,
    uploadActions?: (file: T) => React.ReactNode,
    placeholder?: React.ReactElement,
};

const uploadListStyles = (theme: Theme) => ({
    selectedListItem: {
        backgroundColor: theme.palette.action.selected,
    },
    listItem: {
        paddingTop: 0,
        paddingBottom: 0,
    },
});

function DivComponent(props: any) {
    return <div {...props} />;
}

function UploadListInternal<T extends IUploadedFile>(props: UploadList_Props_t<T> & WithStyles<typeof uploadListStyles>) {
    if (props.files.length === 0) {
        return props.placeholder ?? null;
    }
    return <List disablePadding component={DivComponent}>
        {props.files.map((file, i) => {
            return <ListItem key={i} button onClick={() => props.onUploadClick(file)} classes={{
                root: classnames(props.classes.listItem, {
                    [props.classes.selectedListItem]: file.selected,
                }),
            }}>
                <UploadedFile
                    name={file.fileName}
                    progress={file.progress}
                    error={file.errorMessage}
                    onCancel={() => props.onUploadCancel(file)}
                    actions={props.uploadActions && props.uploadActions(file)}
                />
            </ListItem>;
        })}
    </List>;
}

export default withStyles(uploadListStyles)(UploadListInternal);
