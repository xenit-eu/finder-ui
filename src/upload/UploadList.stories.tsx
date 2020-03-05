import { IconButton, Paper } from "@material-ui/core";
import CloudUpload from "@material-ui/icons/CloudUpload";
import Visibility from "@material-ui/icons/Visibility";
import { action } from "@storybook/addon-actions";
import { number } from "@storybook/addon-knobs";
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
    }, {
        fileName: "File2.doc",
        progress: 0.5,
    }] as IUploadedFile[]);

    return <UploadList
        onUploadCancel={(file: IUploadedFile) => {
            setFiles((existingFiles) => existingFiles.filter((f) => f !== file));
            action("onUploadCancel")([file]);
        }}
        onUploadClick={action("uploadClick")}
        files={files}
        placeholder={<div style={{ height: 100 }}>Drop your files here to upload</div>}
        {...props}
    />;
}

export const normal = () => <Paper>
    <UploadListWithWrapper />
</Paper>;

export const empty = () => <Paper>
    <UploadListWithWrapper files={[]} />
</Paper>;

export const withActions = () => <Paper>
    <UploadListWithWrapper
        uploadActions={(file: IUploadedFile) => <IconButton><Visibility /></IconButton>}
    />
</Paper>;
