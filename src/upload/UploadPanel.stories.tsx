import * as React from "react";
import UploadPanel from "./UploadPanel";
import { action } from "@storybook/addon-actions";
import { IUploadedFile } from "./UploadList";

export default {
    title: "upload/UploadPanel",
    component: UploadPanel,
};

function UploadPanelWrapper() {
    const [files, setFiles] = React.useState([] as IUploadedFile[]);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setFiles(existingFiles => existingFiles.length === 0 ? existingFiles : existingFiles.map(f => f.progress >= 1 ? f : ({ ...f, progress: f.progress + (0.1 * Math.random()) })));

        }, 100);
        return () => clearInterval(interval);
    }, [setFiles]);

    return <UploadPanel
        onUploadAdded={(file: File) => {
            setFiles(existingFiles => existingFiles.concat([{ fileName: file.name, progress: 0 }]));
            action("onUploadAdded")([file]);
        }}
        onUploadCancel={(file: IUploadedFile) => {
            setFiles(existingFiles => existingFiles.filter(f => f !== file));
            action("onUploadCancel")([file]);
        }}
        onUploadEditMetadata={action("uploadEditMetadata")}
        onUploadDone={(file: IUploadedFile) => {
            setFiles(existingFiles => existingFiles.filter(f => f !== file));
            action("uploadDone")([file]);
        }}
        onDoneAll={() => {
            setFiles(existingFiles => existingFiles.filter(f => f.progress <= 1));
            action("doneAll")();
        }}
        files={files}
    />;

}

export const normal = () => <UploadPanelWrapper />;
