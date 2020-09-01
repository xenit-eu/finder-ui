import { TextField } from "@material-ui/core";
import React from "react";
import { FieldRendererComponentProps } from "../FieldRenderer";

export default function TextComponent(props: FieldRendererComponentProps<string, {
    onKeyUp?: (ev: React.KeyboardEvent) => void,
}>) {
    if (props.onChange) {
        return <TextField value={props.value ?? ""} onChange={(e) => props.onChange!(e.target.value)} onKeyUp={props.onKeyUp} fullWidth />;
    } else {
        return <>{props.value ?? ""}</>;
    }
}
