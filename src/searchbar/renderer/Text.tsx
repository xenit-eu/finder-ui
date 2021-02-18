import { TextField } from "@material-ui/core";
import React from "react";
import { FieldRendererComponentProps } from "../FieldRenderer";
import { RenderSimilarity } from "../Similarity";
import HighlightComponent from "./HighlightComponent";

export default function TextComponent(props: FieldRendererComponentProps<string, {
    onKeyDown?: (ev: React.KeyboardEvent) => void,
}>) {
    if (props.onChange) {
        return <TextField value={props.value ?? ""} onChange={(e) => props.onChange!(e.target.value)} inputProps={{
            onKeyDown: props.onKeyDown,
        }} fullWidth />;
    } else {
        return <RenderSimilarity text={props.similarity ?? props.value ?? ""} highlightComponent={HighlightComponent} />;
    }
}
