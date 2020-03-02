import * as React from "react";
import FileDropZone from "./FileDropZone";
import { List, ListItem } from "@material-ui/core";
import UploadedFile from "./UploadedFile";
import Overlay from "../overlay";
import { WithStyles, withStyles } from "@material-ui/core/styles";

export interface IUploadedFile {
    readonly file: File;
    readonly progress: number;
};

export type UploadList_Props_t<T extends IUploadedFile = IUploadedFile> = {
    onFilesDropped: (files: readonly File[]) => void,
    files: readonly T[];
    onUploadClick: (file: T) => void,
    onUploadCancel: (file: T) => void,
    placeholder?: React.ReactElement,
    overlay?: React.ReactElement,
};

const uploadListStyles = {
    listItem: {
        paddingTop: 0,
        paddingBottom: 0,
    },
};

function UploadListInternal<T extends IUploadedFile>(props: UploadList_Props_t<T> & WithStyles<typeof uploadListStyles>) {
    if (props.files.length === 0) {
        return props.placeholder ?? null;
    }
    return <List dense>
        {props.files.map((file, i) => {
            return <ListItem key={i} button onClick={() => props.onUploadClick(file)} classes={{ root: props.classes.listItem }}>
                <UploadedFile name={file.file.name} progress={file.progress} onCancel={() => props.onUploadCancel(file)} />
            </ListItem>;
        })}
    </List>;
}

const UploadList = withStyles(uploadListStyles)(UploadListInternal);

export default function UploadListWithDropZone<T extends IUploadedFile = IUploadedFile>(props: UploadList_Props_t<T>) {
    return <FileDropZone onFilesDropped={props.onFilesDropped}>{(isDragging: boolean) => {
        return <Overlay
            open={isDragging}
            overlay={props.overlay}
        >
            <UploadList {...props} />
        </Overlay>;

    }}</FileDropZone>;
}
