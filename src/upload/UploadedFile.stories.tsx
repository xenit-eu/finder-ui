import { Grid, IconButton, Paper } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import { action } from "@storybook/addon-actions";
import { number, text } from "@storybook/addon-knobs";
import * as React from "react";
import { interceptAction, raceActionWithCustomMessage, sendCustomMessage, stopIntercept } from "../__tests/puppeteerActionInterceptor";
import UploadedFile from "./UploadedFile";

export default {
    title: "upload/UploadedFile",
    component: UploadedFile,
};

export const withoutCancelButton = () => <Paper>
    <Grid container>
        <Grid item xs id="uploadedItem">
            <UploadedFile
                progress={number("progress", 0.5, { range: true, min: 0, max: 1, step: 0.01 })}
                name={text("name", "Some_filename.txt")}
            />
        </Grid>
    </Grid>
</Paper>;

export const withCancelButton = () => <Paper>
    <Grid container>
        <Grid item xs>
            <UploadedFile
                progress={number("progress", 0.5, { range: true, min: 0, max: 1, step: 0.01 })}
                name={text("name", "Some_filename.txt")}
                onCancel={action("cancel")}
            />
        </Grid>
    </Grid>
</Paper>;

withCancelButton.parameters = {
    async puppeteerTest(page: any) {
        const cancelActionPromise = interceptAction(page, "cancel");

        const button = await page.$("button");
        await button.click();
        const cancelActionData = await cancelActionPromise;
        expect(cancelActionData.name).toBe("cancel");

        stopIntercept(page);
    },
};

export const clickable = () => <Paper>
    <Grid container >
        <Grid item xs id="uploadedItem">
            <UploadedFile
                progress={number("progress", 0.5, { range: true, min: 0, max: 1, step: 0.01 })}
                name={text("name", "Some_filename.txt")}
                onCancel={action("cancel")}
                onClick={action("click")}
            />
        </Grid>
    </Grid>
</Paper>;

clickable.parameters = {
    async puppeteerTest(page: any) {
        const cancelActionPromise = interceptAction(page, "cancel");
        const msg = "no click action logged";
        const clickRacePromise = raceActionWithCustomMessage(page, "click", msg);
        const button = await page.$("button");
        await button.click();
        const cancelActionData = await cancelActionPromise;
        expect(cancelActionData.name).toBe("cancel");
        await sendCustomMessage(page, msg);
        await expect(clickRacePromise).resolves.toBe(msg);

        const clickActionPromise = interceptAction(page, "click");
        const uploadedItem = await page.$("#uploadedItem");
        await uploadedItem.click();
        const clickActionData = await clickActionPromise;
        expect(clickActionData.name).toBe("click");

        stopIntercept(page);
    },
};

export const actions = () => <Paper>
    <Grid container >
        <Grid item xs>
            <UploadedFile
                progress={number("progress", 1, { range: true, min: 0, max: 1, step: 0.01 })}
                name={text("name", "Some_filename.txt")}
                onCancel={action("cancel")}
                actions={<IconButton>
                    <Visibility />
                </IconButton>}
            />
        </Grid>
    </Grid>
</Paper>;

export const withError = () => <Paper>
    <Grid container>
        <Grid item xs>
            <UploadedFile
                progress={number("progress", 0, { range: true, min: 0, max: 1, step: 0.01 })}
                name={text("name", "Some_filename.txt")}
                error={text("error", "Upload failed error message")}
                onCancel={action("cancel")}
            />
        </Grid>
    </Grid>
</Paper>;
