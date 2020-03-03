import * as React from "react";
import UploadedFile from "./UploadedFile";
import { Paper, Grid, IconButton } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import { action } from "@storybook/addon-actions";
import { text, number, boolean } from "@storybook/addon-knobs";

export default {
    title: "upload/UploadedFile",
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

export const clickable = () => <Paper>
    <Grid container >
        <Grid item xs>
            <UploadedFile
                progress={number("progress", 0.5, { range: true, min: 0, max: 1, step: 0.01 })}
                name={text("name", "Some_filename.txt")}
                onCancel={action("cancel")}
                onClick={action("click")}
            />
        </Grid>
    </Grid>
</Paper>;

export const actions = () => <Paper>
    <Grid container >
        <Grid item xs>
            <UploadedFile
                progress={number("progress", 0.5, { range: true, min: 0, max: 1, step: 0.01 })}
                name={text("name", "Some_filename.txt")}
                onCancel={action("cancel")}
                actions={<IconButton>
                    <Visibility />
                </IconButton>}
            />
        </Grid>
    </Grid>
</Paper>;
