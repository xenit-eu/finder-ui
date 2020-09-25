import { TextField } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import { useTranslation } from "react-i18next";
import ChipIconButton from "./ChipIconButton";
import ResizableChip from "./ResizableChip";
import useKeypressHandler from "./useKeypressHandler";

type CreateChip_Props_t = {
    /**
     * Current chip data to show
     */
    readonly value?: string;
    /**
     * Function that is called when the chip data is changed
     */
    readonly onChange: (value: string) => void,

    /**
     * Component is in edit mode
     */
    readonly editing: boolean,

    /**
     * Function that is called when editing is initiated
     */
    readonly onBeginEditing: () => void,

    /**
     * Function that is called when editing is cancelled
     */
    readonly onCancelEditing: () => void,

    /**
     * Function that is called when editing is committed
     */
    readonly onCommitEditing: () => void,
};

function CreateChip(props: CreateChip_Props_t) {
    const handlers = {
        onExit: props.editing ? props.onCancelEditing : undefined,
        onCommit: props.editing ? props.onCommitEditing : undefined,
        onModify: !props.editing ? props.onBeginEditing : () => {},
    };
    const keyUp = useKeypressHandler(handlers);
    return <ResizableChip
        onKeyUp={keyUp}
        label={<CreateChipLabel {...handlers} value={props.value} onChange={props.onChange} editing={props.editing} />}
    />;
}

export default CreateChip;

type CreateChipLabel_Props_t = {
    readonly onCommit?: () => void,
    readonly onExit?: () => void,
    readonly onModify: () => void,
    readonly editing: boolean;
    readonly value?: string,
    readonly onChange: (v: string) => void,
};

function CreateChipLabel(props: CreateChipLabel_Props_t) {
    const { t } = useTranslation("finder-ui");
    if (!props.editing) {
        return <>
            &emsp;
            <ChipIconButton onClick={() => props.onModify()} color="primary">
                <AddCircleIcon aria-label={t("searchbar/chips/CreateChip/add")} />
            </ChipIconButton>
            &emsp;
        </>;
    } else {
        return <>
            <TextField value={props.value ?? ""} onChange={(e) => props.onChange(e.target.value)} />
            {props.onCommit && <ChipIconButton onClick={() => props.onCommit!()} color="primary">
                <CheckCircleIcon aria-label={t("searchbar/chips/CreateChip/edit-done")} />
            </ChipIconButton>}
            {props.onExit && <ChipIconButton onClick={() => props.onExit!()} color="inherit">
                <CloseIcon aria-label={t("searchbar/chips/CreateChip/edit-cancel")} />
            </ChipIconButton>}
        </>;
    }
}
