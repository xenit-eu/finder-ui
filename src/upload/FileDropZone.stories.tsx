import { action } from "@storybook/addon-actions";
import * as React from "react";
import { interceptAction, stopIntercept } from "../__tests/puppeteerActionInterceptor";
import FileDropZone from "./FileDropZone";

export default {
    title: "upload/FileDropZone",
    component: FileDropZone,
};

export const normal = () =>
    <FileDropZone id="fileDropZone"
        style={{
            width: "100px",
            height: "100px",
            backgroundColor: "red",
        }}
        onFilesDropped={action("filesDropped")}
    >{
            (isDropping: boolean) => <span>{isDropping ? "Dropping" : "Not dropping"}</span>
        }</FileDropZone>;
