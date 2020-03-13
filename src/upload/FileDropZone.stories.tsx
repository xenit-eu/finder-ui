import { action } from "@storybook/addon-actions";
import * as React from "react";
import { interceptAction, stopIntercept } from "../puppeteerActionInterceptor";
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

normal.story = {
    parameters: {
        async puppeteerTest(page: any) {
            const filesDroppedActionPromise = interceptAction(page, "filesDropped");

            const fileDropZone = await page.$("#fileDropZone");
            await fileDropZone.evaluate((fileDropZoneElem: HTMLDivElement) => {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(new File([""], "file1.txt"));
                dataTransfer.items.add(new File([""], "file2.pdf"));
                const dropEvent = new DragEvent("drop", { dataTransfer, bubbles: true });
                fileDropZoneElem.dispatchEvent(dropEvent);
            });
            const filesDroppedAction = await filesDroppedActionPromise;
            expect(filesDroppedAction.name).toBe("filesDropped");
            expect(filesDroppedAction.args[0].length).toBe(2);

            stopIntercept(page);
        },
    },
};
