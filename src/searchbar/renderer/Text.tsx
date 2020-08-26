import { TextField } from "@material-ui/core";
import React from "react";
import { FieldRendererComponentProps } from "../FieldRenderer";

export default function TextComponent(props: FieldRendererComponentProps<string, {}>) {
    if (props.onChange) {
        return <TextField value={props.value ?? ""} onChange={(e) => props.onChange!(e.target.value)} fullWidth />;
    } else {
        return <>{props.value ?? ""}</>;
    }
}
