import { IconButton, Paper } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import { action } from "@storybook/addon-actions";
import * as React from "react";
import UploadList, { IUploadedFile, UploadList_Props_t } from "./UploadList";

export default {
    title: "upload/UploadList",
    component: UploadList,
};

function UploadListWithWrapper(props: Partial<UploadList_Props_t>) {
    const [files, setFiles] = React.useState([{
        fileName: "Filename.txt",
        progress: 1,
        selected: true,
    }, {
        fileName: "File2.doc",
        progress: 0.5,
    }, {
        fileName: "File3.pdf",
        progress: 0,
        errorMessage: "Upload failed error message",
    }] as IUploadedFile[]);

    return <div id="uploadListDiv">
        <UploadList
            onUploadCancel={(file: IUploadedFile) => {
                setFiles((existingFiles) => existingFiles.filter((f) => f !== file));
                action("onUploadCancel")([file]);
            }}
            onUploadClick={action("uploadClick")}
            files={files}
            placeholder={<div style={{ height: 100 }}>Drop your files here to upload</div>}
            {...props}
        />
    </div>;
}

export const normal = () => <Paper>
    <UploadListWithWrapper />
</Paper>;

export const empty = () => <Paper>
    <UploadListWithWrapper files={[]} />
</Paper>;

export const withActions = () => <Paper>
    <UploadListWithWrapper
        uploadActions={(file: IUploadedFile) => <IconButton onClick={(e) => e.stopPropagation()}><Visibility /></IconButton>}
    />
</Paper>;
