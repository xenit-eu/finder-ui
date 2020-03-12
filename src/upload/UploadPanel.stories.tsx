import { action } from "@storybook/addon-actions";
import { resolve } from "path";
import * as React from "react";
import { interceptAction, stopIntercept } from "../puppeteerActionInterceptor";
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
        onUploadEditMetadata={action("uploadEditMetadata")}
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
interactive.story = {
    parameters: {
        storyshots: { disable: true },
    },
};

export const empty = () => <UploadPanel
    files={[]}
    onUploadAdded={action("uploadAdded")}
    onUploadCancel={action("uploadCancel")}
    onUploadEditMetadata={action("uploadEditMetadata")}
    onUploadDone={action("uploadDone")}
    onDoneAll={action("doneAll")}
/>;

empty.story = {
    parameters: {
        async puppeteerTest(page: any) {
            const filesPath = resolve(__dirname, "../../__tests__");
            const uploadAddedActionPromise = interceptAction(page, "uploadAdded");

            const uploadInput = await page.$("input");
            await uploadInput.uploadFile(filesPath + "/testFile1");
            await uploadInput.evaluate((input: HTMLInputElement) => input.dispatchEvent(new Event("change", { bubbles: true })));
            await uploadAddedActionPromise;

            stopIntercept(page);
        },
    },
};

export const withItems = () => <UploadPanel
    files={[
        {
            fileName: "uploaded-file.txt",
            progress: 1,
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

withItems.story = {
    parameters: {
        async puppeteerTest(page: any) {
            const filesPath = resolve(__dirname, "../../__tests__");
            const uploadAddedActionPromise = interceptAction(page, "uploadAdded");
            const uploadInput = await page.$("input");
            await uploadInput.uploadFile(filesPath + "/testFile1");
            await uploadInput.evaluate((input: HTMLInputElement) => input.dispatchEvent(new Event("change", { bubbles: true })));
            await uploadAddedActionPromise;

            const doneAllActionPromise = interceptAction(page, "doneAll");
            const doneAllButton = await page.$("button[title$='done-all']");
            await doneAllButton.click();
            await doneAllActionPromise;

            const editActionPromise = interceptAction(page, "uploadEditMetadata");
            const editButton = await page.$("button[title$='edit-metadata']");
            await editButton.click();
            await editActionPromise;

            const doneActionPromise = interceptAction(page, "uploadDone");
            const doneButton = await page.$("button[title$='done']");
            await doneButton.click();
            await doneActionPromise;

            const cancelActionPromise = interceptAction(page, "uploadCancel");
            const cancelButton = await page.$("button[title$='cancel']");
            await cancelButton.click();
            await cancelActionPromise;

            stopIntercept(page);
        },
    },
};
