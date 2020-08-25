import { Typography, withStyles } from "@material-ui/core";
import React, { useState } from "react";
import AutocompletePaper from "./AutocompletePaper";

export default {
    title: "searchbar/AutocompletePaper",
    component: AutocompletePaper,
};

// This outline is to ensure that the autocomplete box does not overlap the input element
const AutocompletePaperWithOutline = withStyles({ collapse: { outline: "3px dashed hotpink" } })(AutocompletePaper);

export const closed = () => <div style={{ height: 500, outline: "1px dashed red" }}>
    <AutocompletePaperWithOutline target={<input />} open={false}>
        <Typography variant="body2">Some contents...</Typography>
    </AutocompletePaperWithOutline>
</div>;

export const open = () => <div style={{ height: 500, outline: "1px dashed red" }}>
    <AutocompletePaperWithOutline target={<input />} open={true}>
        <Typography variant="body2">Some contents...</Typography>
    </AutocompletePaperWithOutline>
</div>;

export const maxHeight = () => <div style={{ height: 500, outline: "1px dashed red" }}>
    <AutocompletePaperWithOutline target={<input />} open={true}>
        <div>
            <div style={{ height: 900, width: 100, backgroundColor: "purple", marginLeft: 8 }}></div>
        </div>
    </AutocompletePaperWithOutline>
</div>;

export const interactive = () => {
    const [value, setValue] = useState("");
    return <div style={{ height: 500, outline: "1px dashed red" }}>
        <AutocompletePaperWithOutline target={<input value={value} onChange={(e) => setValue(e.target.value)} />} open={value.length > 0}>
            <Typography variant="body2">You have typed: {value}</Typography>
        </AutocompletePaperWithOutline>
    </div>;
};

interactive.story = {
    parameters: {
        storyshots: {
            disable: true,
        },
    },
};
