import TextField from "material-ui/TextField";
import { Component, createElement as __, DOM as _, FormEvent, ReactNode } from "react";

declare var require: (m: string) => any;
const ChipInput = require("material-ui-chip-input").default;

import { FieldSkeleton_Props_t, RenderMode } from "../fields";
import { ChangeOnBlurTextField } from "./helpers";
import { PropertyRenderConfig_t, PropertyRenderer_t } from "./interface";
import Label from "./label";

type MultiValueTextBox_Props_t = {
    hintText: ReactNode,
    fullWidth: boolean,
    onChange: (evt: FormEvent<{}>, v: string[]) => void,
    value: string[],
};

function MultiValueTextBox(props: MultiValueTextBox_Props_t) {
    return __(ChipInput, {
        fullWidth: props.fullWidth,
        hintText: props.hintText,
        allowDuplicates: true,
        onRequestAdd: (chip: string) => props.onChange(<FormEvent<{}>>{}, props.value.concat([chip])),
        onRequestDelete: (chip: string, index: number) => props.onChange(<FormEvent<{}>>{}, props.value.filter((v, i) => i !== index)),
        value: props.value,
    });
}

const TextBox: PropertyRenderer_t<string | string[]> = (config: PropertyRenderConfig_t<string | string[]>) => {
    const label = Label(config);
    // tslint:disable-next-line:only-arrow-functions
    return function TextBox(props: FieldSkeleton_Props_t) {
        const value = config.mapToView(props.node);
        if (props.renderMode !== RenderMode.VIEW) {
            return _.span({ className: "metadata-field metadata-field-textbox" }, __(<any>(Array.isArray(value) ? MultiValueTextBox : ChangeOnBlurTextField), {
                fullWidth: true,
                hintText: "Type value...",
                onChange: (evt: FormEvent<{}>, v: string | string[]) => {
                    props.onChange(config.mapToModel(props.node, v));
                },
                value,
            }));
        } else {
            return __(label, <any>{ ...props, className: "metadata-value metadata-field-textbox" });
        }
    };
};
export default TextBox;
