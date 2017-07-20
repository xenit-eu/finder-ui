import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import { createElement as __, DOM as _ } from "react";
import { Metadata_t, metadataFields } from "./metadata";

type DialogActions_t = {
    handleClose: () => void,
    handleSave: () => void,
};

function DialogActions ({handleClose, handleSave}: DialogActions_t) {
    return [
        __(FlatButton, { label: "Cancel", primary: true, onTouchTap: handleClose }),
        __(FlatButton, { label: "Save", primary: true, keyboardFocused: true, onTouchTap: handleSave }),
    ];
}

const customContentStyle = {
    width: "90%",
    maxWidth: "none",
};

export type MetaDataDialog_t = {
    opened: boolean,
    fields: Metadata_t[],
    onClose: () => void,
    onSave: (fields: Metadata_t[]) => void,
};

//@Component MetaDataDialog
//@ComponentDescription "Dialog allowing to display and change node metadata (properties)"
//@Method MetaDataDialog Returns ReactComponent
//@MethodDescription "MetaDataDialog({param1: value1, param2: value2, ...})"
//@Param opened boolean "flag indicating whether the dialog must be shown."
//@Param fields Metadata_t[] "list of metadata fields."
//@Param onClose ()=>void "callback called when close/cancel button called (without save)"
//@Param onSave (fields:Metadata_t[])=>void "callback called when save button called"

export function MetaDataDialog ({opened, fields, onClose, onSave}: MetaDataDialog_t) {
    return __(Dialog, {
        key: "dialog",
        title: "Metadata",
        actions: DialogActions({ handleClose: onClose, handleSave: () => onSave(fields) }),
        modal: true,
        open: opened,
        onRequestClose: onClose,
        bodyClassName: "metadata-content",
        contentStyle: customContentStyle,
    },
    metadataFields(fields),
    );
}
