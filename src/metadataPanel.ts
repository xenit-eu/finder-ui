import { DOM as _, createElement as __ } from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import { Metadata_t, metadataFields } from './metadata';


const customContentStyle = {
    width: '90%',
    maxWidth: 'none',
};

export type Metadatapanel_style = {
    Style?: any,
    HeaderStyle?: any,
    ContentStyle?: any,
    Button?: { backgroundColor?: string, labelStyle?: any }
};

export type MetaDataPanel_t = {
    allowEdition: boolean,
    editionMode: boolean,
    fields: Metadata_t[],
    onEdit: () => void,
    onSave: (fields: Metadata_t[]) => void,
    groups?: MetadataPanel_GroupInfo
};
export type MetaDataPanel_Group = {
    label: string,
    id: string,
    expanded: boolean,
    order: number
};
export type MetadataPanel_GroupInfo = {
    Groups: MetaDataPanel_Group[],
    ItemToGroup: { [id: string]: string };
}

export function MetaDataPanel({allowEdition, editionMode, fields, onEdit, onSave, groups}: MetaDataPanel_t, style?: Metadatapanel_style) {
    return _.div({ className: 'metadata' }, [
        allowEdition ? _.div({ className: 'metadata-header' }, [
            editionMode
                ? __(FlatButton, { label: "Save", primary: true, keyboardFocused: true, onTouchTap: () => onSave(fields) })
                : __(FlatButton, { label: "Edit", primary: true, keyboardFocused: true, onTouchTap: () => onEdit() })
        ]) : _.div({ className: 'metadata-header' }),
        _.div({ className: 'metadata-content' + (editionMode ? ' edited' : ''), style: style && style.ContentStyle ? style.ContentStyle : {} }, metadataFields(fields, editionMode, groups))
    ]
    );

}
