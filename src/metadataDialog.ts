import { DOM as _, createElement as __ } from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

export enum MetadataType_t {
    STRING
}

export type Metadata_t = {
    name: string,
    label: string,
    value: string,
    type: MetadataType_t
};

function metadataFilter(a: Metadata_t) {
    return !/\}(store\-protocol|node\-dbid|content|locale|store\-identifier|lastThumbnailModification|node\-uuid)$/.test(a.name);
}

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
    }, fields.filter(metadataFilter).map((field) =>
        __(TextField, {
            key: field.name,
            hintText: "Type value...",
            onChange: (evt: any) => field.value = evt.target.value,
            floatingLabelText: field.label,
            defaultValue: field.value,
            className: 'metadata-field'
        })
    )
    );
}
