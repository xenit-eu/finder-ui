import * as React from "react";
import { TestWrapper } from "../testUtils";
import { DropZone } from "./drop-zone";
import "./drop-zone.stories.less";

export default {
    title: "upload/drop-zone",
    component: DropZone,
};

function fakeUploadProgress(files: File[], progress: (fileIdx: number, progress: number) => void, done: (fileIdx: number, id: string) => void) {
    let currentFile = 0;
    let currentFileProgress = 0;

    let interval = setInterval(() => {
        if (currentFileProgress < 100) {
            currentFileProgress++;
            progress(currentFile, (currentFileProgress / 100) * files[currentFile].size);
        } else if (currentFile < files.length - 1) {
            done(currentFile, "some-id");
            currentFile++;
            currentFileProgress = 0;
        } else {
            clearInterval(interval);
        }
    }, 100);
}

export const normal = () => <TestWrapper>
    <div style={{ width: "calc(100vw - 100px)", height: "calc(100vh - 100px)" }}>
        <DropZone disabled={false} process={fakeUploadProgress} postProcessSelected={() => Promise.resolve(true)}>
            <div style={{ width: "100%", height: "100%", backgroundColor: "red", display: "table-cell" }} />
        </DropZone>
    </div>
</TestWrapper>;
