import { IconButton, Paper } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import { action } from "@storybook/addon-actions";
import * as React from "react";
import { interceptAction, raceActionWithCustomMessage, sendCustomMessage, stopIntercept } from "../__tests/puppeteerActionInterceptor";
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

normal.story = {
    parameters: {
        async puppeteerTest(page: any) {
            const uploadClickActionPromise = interceptAction(page, "uploadClick");

            const uploadListItemsSelector = "div#uploadListDiv > div > *";
            let uploadListItems = await page.$$(uploadListItemsSelector);

            expect(uploadListItems.length).toBe(3);
            await uploadListItems[0].click();
            const uploadClickActionData = await uploadClickActionPromise;
            expect(uploadClickActionData.name).toBe("uploadClick");
            expect(uploadClickActionData.args[0]).toEqual({ fileName: "Filename.txt", progress: 1, selected: true });

            const uploadCancelActionPromise = interceptAction(page, "onUploadCancel");
            const button = await page.$("button");
            await button.click();
            const uploadCancelActionData = await uploadCancelActionPromise;
            expect(uploadCancelActionData.name).toBe("onUploadCancel");
            expect(uploadCancelActionData.args[0][0]).toEqual({ fileName: "File2.doc", progress: 0.5 });

            uploadListItems = await page.$$(uploadListItemsSelector);
            expect(uploadListItems.length).toBe(2);
            const itemName = await uploadListItems[0].evaluate((item: HTMLDivElement) => item.innerText);
            expect(itemName).toContain("Filename.txt");

            stopIntercept(page);
        },
    },
};

export const empty = () => <Paper>
    <UploadListWithWrapper files={[]} />
</Paper>;

export const withActions = () => <Paper>
    <UploadListWithWrapper
        uploadActions={(file: IUploadedFile) => <IconButton onClick={(e) => e.stopPropagation()}><Visibility /></IconButton>}
    />
</Paper>;

withActions.story = {
    parameters: {
        async puppeteerTest(page: any) {
            const msg = "no click action logged";
            const racePromise = raceActionWithCustomMessage(page, "uploadClick", msg);

            const button = await page.$("button");
            await button.click();
            await sendCustomMessage(page, msg);
            await expect(racePromise).resolves.toBe(msg);

            stopIntercept(page);
        },
    },
};
