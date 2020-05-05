import { action } from "@storybook/addon-actions";
import { resolve } from "path";
import * as React from "react";
import { interceptAction, stopIntercept } from "../__tests/puppeteerActionInterceptor";
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

normal.story = {
    parameters: {
        async puppeteerTest(page: any) {
            const filesPath = resolve(__dirname, "../../__tests__");
            const filesSelectedActionPromise = interceptAction(page, "filesSelected");

            const inputHandle = await page.$("input");
            await inputHandle.uploadFile(filesPath + "/testFile1", filesPath + "/testFile2");
            const filesLength = await inputHandle.evaluate((i: HTMLInputElement) => i.files!.length);
            expect(filesLength).toBe(2);
            await inputHandle.evaluate((i: HTMLInputElement) => i.dispatchEvent(new Event("change", { bubbles: true })));
            const filesSelectedActionData = await filesSelectedActionPromise;
            expect(filesSelectedActionData.name).toBe("filesSelected");
            expect(filesSelectedActionData.args[0].length).toBe(2);

            stopIntercept(page);
        },
    },
};
