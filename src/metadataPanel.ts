import { DOM as _, createElement as __ } from 'react';
import { FlatButton } from 'material-ui/FlatButton';
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
export type Metadatapanel_style = {
    Style?: any,
    HeaderStyle?: any,
    ContentStyle?: any,
    Button?: { backgroundColor?: string, labelStyle?: any }
};

export function MetaDataPanel({editionMode, fields, onEdit, onSave}: MetaDataPanel_t, st: Metadatapanel_style) {
    return _.div({ className: 'metadata', style: {} }, [
        _.div({ className: 'metadata-header', style: {} },
            [ ]),
        _.div({ className: 'metadata-content', style: st.ContentStyle ? st.ContentStyle : {} },
            metadataFields(fields))
    ]
    );
}
