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

const customContentStyle = {
    width: '90%',
    maxWidth: 'none',
};

export type MetaData_t = {
    fields: Metadata_t[],
    onSave: (fields: Metadata_t[]) => void
};

export function MetaData({fields, onSave}: MetaData_t) {
    return _.div({ className: 'metadata' }, [
        _.div({className: 'metadata-header'}, __(FlatButton, { label: "Save", primary: true, keyboardFocused: true, onTouchTap: () => onSave(fields) })),
        _.div({className: 'metadata-content'}, fields.filter(metadataFilter).map((field) =>
            __(TextField, {
                key: field.name,
                hintText: "Type value...",
                onChange: (evt : any) => field.value = evt.target.value,
                floatingLabelText: field.label,
                defaultValue: field.value,
                className: 'metadata-field'
            })
        ))
    ]
    );
}
