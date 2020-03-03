import * as React from "react";
import UploadList, { IUploadedFile, UploadList_Props_t } from "./UploadList";
import { Paper, IconButton } from "@material-ui/core";
import CloudUpload from "@material-ui/icons/CloudUpload";
import Visibility from "@material-ui/icons/Visibility";
import { action } from "@storybook/addon-actions";
import { number } from "@storybook/addon-knobs";
import { OverlayCentered } from "../overlay";

export default {
    title: "upload/UploadList",
    component: UploadList,
};

type UploadListWithWrapper_Props_t = {
    uploadSpeed: number,
} & Partial<UploadList_Props_t>;
function UploadListWithWrapper({ uploadSpeed, ...props }: UploadListWithWrapper_Props_t) {
    const [files, setFiles] = React.useState([{
        fileName: "Filename.txt",
        progress: 1,
    }, {
        fileName: "File2.doc",
        progress: 0.5,
    }] as IUploadedFile[]);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setFiles(sFiles => sFiles.map(file => ({ ...file, progress: file.progress + (uploadSpeed * Math.random()) })));
        }, 100);
        return () => clearInterval(timer);
    });

    return <UploadList
        onFilesDropped={(uploadedFiles: readonly File[]) => {
            const uploadedFileObjects = uploadedFiles.map(file => ({ fileName: file.name, progress: 0 }));
            setFiles(existingFiles => existingFiles.concat(uploadedFileObjects));
            action("filesDropped")([uploadedFiles]);
        }}
        onUploadCancel={(file: IUploadedFile) => {
            setFiles(existingFiles => existingFiles.filter(f => f !== file))
            action("onUploadCancel")([file]);
        }}
        onUploadClick={action("uploadClick")}
        files={files}
        placeholder={<div style={{ height: 100 }}>Drop your files here to upload</div>}
        overlay={<OverlayCentered style={{ fontSize: 80 }}>
            <CloudUpload nativeColor="white" fontSize="inherit" />
        </OverlayCentered>}
        {...props}
    />;
}

export const normal = () => <Paper>
    <UploadListWithWrapper
        uploadSpeed={number("uploadSpeed", 0.02, { range: true, min: 0, max: 1, step: 0.01 })}
    />
</Paper>;

export const withActions = () => <Paper>
    <UploadListWithWrapper
        uploadSpeed={number("uploadSpeed", 0.02, { range: true, min: 0, max: 1, step: 0.01 })}
        uploadActions={(file: IUploadedFile) => <IconButton><Visibility /></IconButton>}
    />
</Paper>
