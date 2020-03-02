
import * as React from "react";
import UploadList, { IUploadedFile } from "./UploadList";
import { Paper } from "@material-ui/core";
import { action } from "@storybook/addon-actions";
import { withKnobs, text, number, boolean } from "@storybook/addon-knobs";

export default {
    title: "upload/UploadList",
    decorators: [withKnobs],
    component: UploadList,
};

type UploadListWithWrapper_Props_t = {
    uploadSpeed: number,
};
function UploadListWithWrapper(props: UploadListWithWrapper_Props_t) {
    const [files, setFiles] = React.useState([] as IUploadedFile[]);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setFiles(sFiles => sFiles.map(file => ({ ...file, progress: file.progress + (props.uploadSpeed * Math.random()) })));
        }, 100);
        return () => clearInterval(timer);
    });

    return <UploadList
        onFilesDropped={(uploadedFiles: readonly File[]) => {
            const uploadedFileObjects = uploadedFiles.map(file => ({ file, progress: 0 }));
            setFiles(existingFiles => existingFiles.concat(uploadedFileObjects));
            action("filesDropped")([uploadedFiles]);
        }}
        onUploadCancel={(file: IUploadedFile) => {
            setFiles(existingFiles => existingFiles.filter(f => f !== file))
            action("filesDropped")([file]);
        }}
        onUploadClick={action("uploadClick")}
        files={files}
    />;
}

export const normal = () => <Paper>
    <UploadListWithWrapper uploadSpeed={number("uploadSpeed", 0.02, { range: true, min: 0, max: 1, step: 0.01 })} />
</Paper>;
