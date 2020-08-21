import { TextField } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CloseIcon from "@material-ui/icons/Close";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import invariant from "tiny-invariant";
import StopPropagation from "../../util/StopPropagation";
import ChipIconButton from "./ChipIconButton";
import ResizableChip from "./ResizableChip";
import useKeypressHandler from "./useKeypressHandler";

// @internal
// tslint:disable-next-line
export const _editing = Symbol();

type CreateChip_Props_t = {
    readonly onCreate: (value: string) => void,
    // @internal for storybook testing only
    readonly _editing?: typeof _editing;
};

function CreateChip(props: CreateChip_Props_t) {
    const [value, setValue] = useState<string | null>(props._editing ? "" : null);
    const keyUp = useKeypressHandler({
        onCommit: () => value === null ? setValue("") : (props.onCreate(value), setValue(null)),
        onExit: () => setValue(null),
        onModify: () => setValue(""),
    });
    return <ResizableChip
        onKeyUp={keyUp}
        label={<CreateChipLabel {...props} value={value} setValue={setValue}/>}
    />;
}

export default CreateChip;

type CreateChipLabel_Props_t = CreateChip_Props_t & {
    value: string|null,
    setValue: (v: string|null) => void,
};

function CreateChipLabel({ value, setValue, ...props }: CreateChipLabel_Props_t) {
    const { t } = useTranslation("finder-ui");
    if (props._editing) {
        invariant(props._editing === _editing, "_editing is internal, only to be used in storybook.");
    }

    if (value === null) {
        return <>
            &emsp;
            <ChipIconButton onClick={() => setValue("")} color="primary">
                <AddCircleIcon aria-label={t("searchbar/chips/CreateChip/add")} />
            </ChipIconButton>
            &emsp;
        </>;
    } else {
        return <>
            <TextField value={value} onChange={(e) => setValue(e.target.value)} />
            <ChipIconButton onClick={() => props.onCreate(value)} color="primary">
                <CheckCircleIcon aria-label={t("searchbar/chips/CreateChip/edit-done")} />
            </ChipIconButton>
            <ChipIconButton onClick={() => setValue(null)} color="inherit">
                <CloseIcon aria-label={t("searchbar/chips/CreateChip/edit-cancel")} />
            </ChipIconButton>
        </>;
    }
}
