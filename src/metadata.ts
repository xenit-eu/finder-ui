import { DOM as _, createElement as __, Component, ReactElement } from 'react';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import AutoComplete from 'material-ui/AutoComplete';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { MetaDataPanel_Group, MetadataPanel_GroupInfo } from './metadataPanel'

export enum MetadataType_t {
    STRING,
    DATE,
    LIST
}

export type Metadata_t = {
    name: string,
    label: string,
    value: string,
    disable: boolean,
    type: MetadataType_t,
    options?: any  // list of values if type = "LIST", format [{value: 'aaa', text: 'AAA'}, ...]
};


// SelectField wrapper component to be able to change the current value 
// when selecting a new item from the drop-down list.
class SelectionField extends Component<any, any> {
    state = { value: this.props.field.value };
    render() {
        return __(SelectField, {
            floatingLabelText: this.props.field.label,
            value: this.state.value,
            disabled: this.props.disable,
            onChange: (event: any, key: number, payload: any) => {
                this.props.field.value = payload;
                this.setState({ value: payload })
            }
        },
            this.props.field.options.map((a: any) => __(MenuItem, { value: a.value, primaryText: a.text }))
        );
    }
}


// allows to remove by default alfresco system fields !
function metadataFilter(a: Metadata_t) : boolean {
    return !/\}(store\-protocol|node\-dbid|content|locale|store\-identifier|lastThumbnailModification|node\-uuid)$/.test(a.name);
}


function metadataField (field: Metadata_t, editable: boolean) : ReactElement<any>  {
    let disable = field.disable;
    if (!editable) {
        disable = true;
    }
    switch (field.type) {
        case MetadataType_t.DATE:
            return _.span({ className: 'metadata-field' }, __(DatePicker, {
                hintText: "Portrait Inline Dialog",
                container: "inline",
                disabled: disable,
                floatingLabelText: field.label,
                autoOk: true,
                onChange: (empty: any, newDate: Date) => field.value = newDate.toISOString(),
                defaultDate: new Date(field.value),
            }));

        case MetadataType_t.LIST:
            return _.span({ className: 'metadata-field select' }, __(SelectionField, {
                field: field,
                disable: disable
            }));

        case MetadataType_t.STRING:
            return _.span({ className: 'metadata-field' }, __(TextField, {
                key: field.name + field.value,
                hintText: "Type value...",
                onChange: (evt: any) => field.value = evt.target.value,
                disabled: disable,
                floatingLabelText: field.label,
                defaultValue: field.value,
            }));
    }
    throw "Did not return properly";
}
const defaultGroup = {
    label: "Default",
    id: "default",
    expanded: true,
    order: 1000
};

function fieldsInGroups (fields: Metadata_t[],groupInfo: MetadataPanel_GroupInfo){
 let groupsWithChildren: { [id: string]: { group: MetaDataPanel_Group, items: Metadata_t[] } } =
        { "default": { group: defaultGroup, items: [] } };
    groupInfo.Groups.forEach(g => groupsWithChildren[g.id] = ({ group: g, items: [] }));
    fields.forEach(f => groupsWithChildren[groupInfo.ItemToGroup[f.name] ? groupInfo.ItemToGroup[f.name] : "default"].items.push(f));
    let groupsWithChildrenList = Object.keys(groupsWithChildren).map(id => groupsWithChildren[id]);
    groupsWithChildrenList.sort((a, b) => a.group.order - b.group.order);
    return groupsWithChildrenList;
}

export function metadataFields (fields: Metadata_t[], editable: boolean = true, groupInfo: MetadataPanel_GroupInfo | undefined = undefined) : ReactElement<any>[] {
    const filteredFields = fields.filter(metadataFilter);
    if (!groupInfo) {
        return filteredFields.map(f => metadataField(f, editable));
    } else {
        let groupsWithChildrenList = fieldsInGroups(fields,groupInfo);
        return groupsWithChildrenList.map(g => {
            const expandable = g.group.id != "default";
            const childItems = g.items.map(f => __(CardText, { expandable: expandable }, _.div({},metadataField(f, editable))));
            const header = __(CardHeader, { title: g.group.label, actAsExpander: expandable, showExpandableButton: expandable });
            const items = [header,...childItems];
            return __(Card, {}, items);
        });
    }
}