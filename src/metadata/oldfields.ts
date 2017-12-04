import AutoComplete from "material-ui/AutoComplete";
import { Card, CardActions, CardHeader, CardText } from "material-ui/Card";
import DatePicker from "material-ui/DatePicker";
import FlatButton from "material-ui/FlatButton";
import MenuItem from "material-ui/MenuItem";
import SelectField from "material-ui/SelectField";
import TextField from "material-ui/TextField";
import { Component, createElement as __, DOM as _, ReactElement } from "react";
import { MetaDataPanelGroup_t, MetaDataPanelGroupInfo_t } from "../metadataPanel";
import {Field_t, MetadataFields, Template_t} from "./fields";

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

export function metadataField(field: Metadata_t, editable: boolean): ReactElement<any> {
    let disable = field.disable;
    if (!editable) {
        disable = true;
    }
    switch (field.type) {
        case MetadataType_t.DATE:
            return _.span({ className: "metadata-field" }, __(DatePicker, {
                hintText: "Portrait Inline Dialog",
                container: "inline",
                disabled: disable,
                floatingLabelText: field.label,
                autoOk: true,
                onChange: (empty: any, newDate: Date) => field.value = newDate.toISOString(),
                defaultDate: new Date(field.value),
            }));

        case MetadataType_t.LIST:
            return _.span({ className: "metadata-field select" }, __(SelectionField, {
                field,
                disable,
            }));

        case MetadataType_t.STRING:
            return _.span({ className: "metadata-field" }, __(TextField, {
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

/**
 * Wrapper for legacy Metadata_t value that dispatches onChange when its value is modified
 */
class LegacyValueWrapper {
    constructor(private metadata: Metadata_t, private onChange: (value: Metadata_t) => void) {
    }
    public get name(): string {
        return this.metadata.name;
    }
    public get value(): string {
        return this.metadata.value;
    }
    public set value(v: string) {
        this.metadata.value = v;
        this.onChange(this.metadata);
    }
    public get label(): string {
        return this.metadata.label;
    }
    public get disable(): boolean {
        return this.metadata.disable;
    }
    public get type(): MetadataType_t {
        return this.metadata.type;
    }
    public get options(): any|undefined {
        return this.metadata.options;
    }
}

const legacyTemplate: Template_t<Metadata_t, null> = ({value, renderParameters, editEnabled, onChange}) => {
    if (!metadataFilter(value)) {
        return _.span({ style: { display: "none" } });
    }
    return metadataField(new LegacyValueWrapper(value, onChange), editEnabled);
};

const upgradeLegacyValue = (field: Metadata_t): Field_t<Metadata_t, null> => ({
    value: field,
    template: legacyTemplate,
    parameters: null,
});

type Group_t = {
    expandable: boolean,
    children: Metadata_t,
    label: string,
};

const legacyGroupTemplate: Template_t<Metadata_t[], { label: string, expandable: boolean, expanded: boolean}> = ({ value, renderParameters, editEnabled, onChange }) => {
    return __(Card, { initiallyExpanded: renderParameters.expanded }, [
        __(CardHeader, { title: renderParameters.label, actAsExpander: renderParameters.expandable, showExpandableButton: renderParameters.expandable }),
        __(CardText, { expandable: renderParameters.expandable },
            __(MetadataFields, {
                fields: value.map(upgradeLegacyValue),
                editable: editEnabled,
                onChange,
            }),
        ),
    ]);
};

const upgradeLegacyGroup= (group: LegacyGroup_t): Field_t<Metadata_t[], {label: string, expandable: boolean, expanded: boolean}> => ({
    value: group.items,
    template: legacyGroupTemplate,
    parameters: {
        label: group.group.label,
        expandable: group.group.id !== "default",
        expanded: group.group.expanded,
    },
});

const defaultGroup = {
    label: "Default",
    id: "default",
    expanded: true,
    order: 1000,
};

type LegacyGroup_t = { group: MetaDataPanelGroup_t, items: Metadata_t[] };

function legacyUpdateInPlace(oldValues: Metadata_t[], newValues: Metadata_t[]) {
    newValues.forEach(v => { let m = oldValues.find(o => v.name === o.name); if (m) { m.value = v.value; } });
}

function fieldsInGroups(fields: Metadata_t[], groupInfo: MetaDataPanelGroupInfo_t): LegacyGroup_t[] {
    let groupsWithChildren: {[id: string]: LegacyGroup_t} = { default: { group: defaultGroup, items: [] } };
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
    //const filteredFields = fields.filter(metadataFilter);
    if (!groupInfo) {
        return [
            __(MetadataFields, {
                fields: fields.map(upgradeLegacyValue),
                editable,
                onChange: legacyUpdateInPlace.bind(null, fields),
            }),
        ];
    } else {
        let groupsWithChildrenList = fieldsInGroups(fields, groupInfo);
        return [
            __(MetadataFields, {
                fields: groupsWithChildrenList.map(upgradeLegacyGroup),
                editable,
                onChange: legacyUpdateInPlace.bind(null, fields),
            }),
        ];
    }
}
