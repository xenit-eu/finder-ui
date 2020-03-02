import * as React from "react";
import FileDropZone from "./FileDropZone";
import { List, ListItem } from "@material-ui/core";
import UploadedFile from "./UploadedFile";
import { Theme, WithStyles, withStyles } from "@material-ui/core/styles";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import classnames from "classnames";

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
    // @internal
    _forceOverlay?: boolean,
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

function UploadListOverlay({ overlay, ...props }: Pick<UploadList_Props_t, "overlay"> & React.HTMLAttributes<HTMLDivElement>) {
    if (!overlay) {
        return null;
    }

    return <div {...props}>{overlay}</div>;
}

const uploadListWithDropZoneStyles = (theme: Theme) => ({
    overlayWrap: {
        position: "relative",
    } as CSSProperties,
    overlayComponent: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: theme.zIndex.tooltip,
    } as CSSProperties,
    overlayComponentHidden: {
        display: "none",
    } as CSSProperties,
});

function UploadListWithDropZone<T extends IUploadedFile = IUploadedFile>(props: UploadList_Props_t<T> & WithStyles<typeof uploadListWithDropZoneStyles>) {
    return <FileDropZone onFilesDropped={props.onFilesDropped}>{(isDragging: boolean) => {
        return <div className={props.classes.overlayWrap}>
            <UploadListOverlay
                overlay={props.overlay}
                className={classnames(
                    props.classes.overlayComponent,
                    {
                        [props.classes.overlayComponentHidden]: !props._forceOverlay && !isDragging,
                    },
                )} />
            <UploadList {...props} />
        </div>;
    }}</FileDropZone>;
}

export default withStyles(uploadListWithDropZoneStyles)(UploadListWithDropZone);
