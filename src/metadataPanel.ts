import { DOM as _, createElement as __ } from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import { Metadata_t, metadataFields } from './metadata';


const customContentStyle = {
    width: '90%',
    maxWidth: 'none',
};

export type MetaDataPanel_t = {
    editionMode: boolean,
    fields: Metadata_t[],
    onEdit: () => void,
    onSave: (fields: Metadata_t[]) => void
};

export function MetaDataPanel ({editionMode, fields, onEdit, onSave} : MetaDataPanel_t) {
    return _.div({ className: 'metadata' }, [
        _.div({className: 'metadata-header'}, [
            editionMode 
                ? __(FlatButton, { label: "Save", primary: true, keyboardFocused: true, onTouchTap: () => onSave(fields) }) 
                : __(FlatButton, { label: "Edit", primary: true, keyboardFocused: true, onTouchTap: () => onEdit() })
        ]),
        _.div({className: 'metadata-content'}, metadataFields(fields))
    ]
    );
}
