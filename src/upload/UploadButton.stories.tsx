import { action } from "@storybook/addon-actions";
import { resolve } from "path";
import * as React from "react";
import UploadButton from "./UploadButton";

export default {
    title: "upload/UploadButton",
    component: UploadButton,
};

export const normal = () =>
    <UploadButton
        style={{
            width: "100px",
            height: "100px",
            backgroundColor: "red",
        }}
        onFilesSelected={action("filesSelected")}
    >Click to upload files</UploadButton>;
