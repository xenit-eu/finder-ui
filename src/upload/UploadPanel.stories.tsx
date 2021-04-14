import { action } from "@storybook/addon-actions";
import { resolve } from "path";
import * as React from "react";
import { IUploadedFile } from "./UploadList";
import UploadPanel from "./UploadPanel";

export default {
    title: "upload/UploadPanel",
    component: UploadPanel,
};

function UploadPanelWrapper() {
    const [files, setFiles] = React.useState([] as IUploadedFile[]);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setFiles((existingFiles) => existingFiles.length === 0 ? existingFiles : existingFiles.map((f) => f.progress >= 1 ? f : ({ ...f, progress: f.progress + (0.1 * Math.random()) })));

        }, 100);
        return () => clearInterval(interval);
    }, [setFiles]);

    return <UploadPanel
        onUploadAdded={(file: File) => {
            setFiles((existingFiles) => existingFiles.concat([{ fileName: file.name, progress: 0 }]));
            action("onUploadAdded")([file]);
        }}
        onUploadCancel={(file: IUploadedFile) => {
            setFiles((existingFiles) => existingFiles.filter((f) => f !== file));
            action("onUploadCancel")([file]);
        }}
        onUploadEditMetadata={(editingFiles: IUploadedFile[]) => {
            setFiles(((existingFiles) => existingFiles.map((f) => editingFiles.indexOf(f) !== -1 ? { ...f, selected: true } : f)));
            action("uploadEditMetadata")([editingFiles]);
        }}
        onUploadDone={(file: IUploadedFile) => {
            setFiles((existingFiles) => existingFiles.filter((f) => f !== file));
            action("uploadDone")([file]);
        }}
        onDoneAll={() => {
            setFiles((existingFiles) => existingFiles.filter((f) => f.progress <= 1));
            action("doneAll")();
        }}
        files={files}
    />;

}

export const interactive = () => <UploadPanelWrapper />;
interactive.parameters = {
    storyshots: { disable: true },
};

export const empty = () => <UploadPanel
    files={[]}
    onUploadAdded={action("uploadAdded")}
    onUploadCancel={action("uploadCancel")}
    onUploadEditMetadata={action("uploadEditMetadata")}
    onUploadDone={action("uploadDone")}
    onDoneAll={action("doneAll")}
/>;

export const withItems = () => <UploadPanel
    files={[
        {
            fileName: "uploaded-file.txt",
            progress: 1,
        },
        {
            fileName: "failed-file.txt",
            progress: 0,
            errorMessage: "Upload failed error message",
        },
        {
            fileName: "uploading-file.txt",
            progress: 0.43,
        },
        {
            fileName: "pending-file.txt",
            progress: 0,
        },
    ]}
    onUploadAdded={action("uploadAdded")}
    onUploadCancel={action("uploadCancel")}
    onUploadEditMetadata={action("uploadEditMetadata")}
    onUploadDone={action("uploadDone")}
    onDoneAll={action("doneAll")}
/>;
