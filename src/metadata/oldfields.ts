import AutoComplete from "material-ui/AutoComplete";
import { Card, CardActions, CardHeader, CardText } from "material-ui/Card";
import DatePicker from "material-ui/DatePicker";
import FlatButton from "material-ui/FlatButton";
import MenuItem from "material-ui/MenuItem";
import SelectField from "material-ui/SelectField";
import TextField from "material-ui/TextField";
import { Component, createElement as __, ReactElement } from "react";
import * as _ from "react-dom-factories";
import { MetaDataPanelGroup_t, MetaDataPanelGroupInfo_t } from "../metadataPanel";

export enum MetadataType_t {
    STRING,
    DATE,
    LIST,
}

/* #### Metadata field structure

| Key    | Description                             |
|--------------|-----------                                |
| name | internal name of the property (alfresco property name)    |
| label| displayable name of the property    |
| value| current value of the property    |
| type | type : STRING, ...    |
 */
export type Metadata_t = {
    name: string,
    label: string,
    value: string,
    disable: boolean,
    type: MetadataType_t,
    options?: any,  // list of values if type = "LIST", format [{value: 'aaa', text: 'AAA'}, ...]
};

// SelectField wrapper component to be able to change the current value
// when selecting a new item from the drop-down list.
class SelectionField extends Component<any, any> {
    public state = { value: this.props.field.value };
    public render() {
        return __(SelectField, {
            floatingLabelText: this.props.field.label,
            value: this.state.value,
            disabled: this.props.disable,
            onChange: (event: any, key: number, payload: any) => {
                this.props.field.value = payload;
                this.setState({ value: payload });
            },
        },
            this.props.field.options.map((a: any) => __(MenuItem, { value: a.value, primaryText: a.text })),
        );
    }
}

// allows to remove by default alfresco system fields !
function metadataFilter(a: Metadata_t): boolean {
    return !/\}(store\-protocol|node\-dbid|content|locale|store\-identifier|lastThumbnailModification|node\-uuid)$/.test(a.name);
}

export function metadataField(field: Metadata_t, editable: boolean, key: string): ReactElement<any> {
    let disable = field.disable;
    if (!editable) {
        disable = true;
    }
    switch (field.type) {
        case MetadataType_t.DATE:
            return _.span({ key, className: "metadata-field" }, __(DatePicker, {
                hintText: "Portrait Inline Dialog",
                container: "inline",
                disabled: disable,
                floatingLabelText: field.label,
                autoOk: true,
                onChange: (empty: any, newDate: Date) => field.value = newDate.toISOString(),
                defaultDate: new Date(field.value),
            }));

        case MetadataType_t.LIST:
            return _.span({ key, className: "metadata-field select" }, __(SelectionField, {
                field,
                disable,
            }));

        case MetadataType_t.STRING:
            return _.span({ key, className: "metadata-field" }, __(TextField, {
                key: field.name + field.value,
                hintText: "Type value...",
                onChange: (evt: any) => field.value = evt.target.value,
                disabled: disable,
                floatingLabelText: field.label,
                defaultValue: field.value,
            }));
        default:
            throw "Did not return properly";
    }
}
const defaultGroup = {
    label: "Default",
    id: "default",
    expanded: true,
    order: 1000,
};

function fieldsInGroups(fields: Metadata_t[], groupInfo: MetaDataPanelGroupInfo_t) {
    let groupsWithChildren: { [id: string]: { group: MetaDataPanelGroup_t, items: Metadata_t[] } } = { default: { group: defaultGroup, items: [] } };
    groupInfo.groups.forEach(g => groupsWithChildren[g.id] = ({ group: g, items: [] }));
    fields.forEach(f => groupsWithChildren[groupInfo.itemToGroup[f.name] ? groupInfo.itemToGroup[f.name] : "default"].items.push(f));
    if (groupsWithChildren["default"].items.length === 0) {
        delete groupsWithChildren["default"];
    }
    let groupsWithChildrenList = Object.keys(groupsWithChildren).map(id => groupsWithChildren[id]);
    groupsWithChildrenList.sort((a, b) => a.group.order - b.group.order);
    return groupsWithChildrenList;
}
export function metadataFields(fields: Metadata_t[], editable: boolean = true, groupInfo: MetaDataPanelGroupInfo_t | undefined = undefined): Array<ReactElement<any>> {
    const filteredFields = fields.filter(metadataFilter);
    if (!groupInfo) {
        return filteredFields.map((f, i) => metadataField(f, editable, "" + i));
    } else {
        let groupsWithChildrenList = fieldsInGroups(fields, groupInfo);
        return groupsWithChildrenList.map((g, i) => {
            const expandable = g.group.id !== "default";
            const childItems = g.items.map((f, j) => __(CardText, { key: "text" + j, expandable }, _.div({}, metadataField(f, editable, "" + j))));
            const header = __(CardHeader, { key: "header", title: g.group.label, actAsExpander: expandable, showExpandableButton: expandable });
            const items = [header, ...childItems];
            return __(Card, { key: i, initiallyExpanded: g.group.expanded }, items);
        });
    }
}
