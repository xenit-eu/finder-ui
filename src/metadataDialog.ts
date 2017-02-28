import { DOM as _, createElement as __ } from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import { Metadata_t, metadataFields } from './metadata';

type DialogActions_t = {
    handleClose: () => void, 
    handleSave: () => void
};

function DialogActions ({handleClose, handleSave} : DialogActions_t) {
    return [
        __(FlatButton, { label: "Cancel", primary: true, onTouchTap: handleClose }),
        __(FlatButton, { label: "Save", primary: true, keyboardFocused: true, onTouchTap: handleSave }),
    ];
}

const customContentStyle = {
    width: '90%',
    maxWidth: 'none',
};

export type MetaDataDialog_t = {
    opened: boolean,
    fields: Metadata_t[],
    onClose: () => void,
    onSave: (fields: Metadata_t[]) => void
};

export function MetaDataDialog ({opened, fields, onClose, onSave}: MetaDataDialog_t) {
    return __(Dialog, {
        title: "Metadata",
        actions: DialogActions({ handleClose: onClose, handleSave: () => onSave(fields) }),
        modal: true,
        open: opened,
        onRequestClose: onClose,
        bodyClassName: 'metadata-content',
        contentStyle: customContentStyle
    }, 
    metadataFields(fields)
    );
}
