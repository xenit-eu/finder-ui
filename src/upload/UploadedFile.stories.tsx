import * as React from "react";
import { useState, useEffect } from "react";
import UploadedFile from "./UploadedFile";
import { Paper, Grid } from "@material-ui/core";
import { action } from "@storybook/addon-actions";
import { withKnobs, text, number, boolean } from "@storybook/addon-knobs";

export default {
    title: "upload/UploadedFile",
    decorators: [withKnobs],
    component: UploadedFile,
};

export const withoutCancelButton = () => <Paper>
    <Grid container>
        <Grid item xs>
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
