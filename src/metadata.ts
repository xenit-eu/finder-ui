import { DOM as _, createElement as __, Component } from 'react';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import AutoComplete from 'material-ui/AutoComplete';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


export enum MetadataType_t {
    STRING,
    DATE,
    LIST
}

export type Metadata_t = {
    name: string,
    label: string,
    value: string,
    type: MetadataType_t,
    options?: any  // list of values if type = "LIST", format [{value: 'aaa', text: 'AAA'}, ...]
};


// SelectField wrapper component to be able to change the current value 
// when selecting a new item from the drop-down list.
class SelectionField extends Component<any, any> {
    state = {value: this.props.field.value};
    render () {
        return __(SelectField, {
            floatingLabelText: this.props.field.label,
            value: this.state.value,
            onChange: (event: any, key: number, payload: any) => { 
                this.props.field.value = payload; 
                this.setState({value: payload}) 
            }
        }, 
        this.props.field.options.map((a : any) => __(MenuItem, {value: a.value, primaryText: a.text}))   
        );
    }
}


// allows to remove by default alfresco system fields !
function metadataFilter(a: Metadata_t) {
    return !/\}(store\-protocol|node\-dbid|content|locale|store\-identifier|lastThumbnailModification|node\-uuid)$/.test(a.name);
}

export function metadataFields (fields: Metadata_t[]) {
    return fields.filter(metadataFilter).map((field) => {
        switch(field.type) {
            case MetadataType_t.DATE:
                return _.span({className: 'metadata-field'}, __(DatePicker, {
                    hintText: "Portrait Inline Dialog", 
                    container: "inline",
                    floatingLabelText: field.label,
                    autoOk: true,
                    onChange: (empty : any, newDate: Date) => field.value = newDate.toISOString(),
                    defaultDate: new Date(field.value),
                }));

/*            case MetadataType_t.LIST:
                 return _.span({className: 'metadata-field'}, __(AutoComplete, {
                    floatingLabelText: field.label,
                    filter: AutoComplete.caseInsensitiveFilter,
                    onNewRequest: (chosenRequest : string, index : number) => { console.log(chosenRequest, index); if (index >= 0) field.value = field.options[index].value  },
                    openOnFocus: true,
                    dataSource: field.options ? field.options : [],
                 }));
            case MetadataType_t.LIST:
                 return _.span({className: 'metadata-field select'}, __(SelectField, {
                        floatingLabelText: field.label,
                        value: field.value,
                        onChange: (event: any, key: number, payload: any) => field.value = payload
                    }, 
                    field.options.map((a : any) => __(MenuItem, {value: a.value, primaryText: a.text}))   
                 ));
*/

            case MetadataType_t.LIST:
                 return _.span({className: 'metadata-field select'}, __(SelectionField, {
                        field: field
                    }));

            case MetadataType_t.STRING:
                return _.span({className: 'metadata-field'}, __(TextField, {
                    key: field.name,
                    hintText: "Type value...",
                    onChange: (evt: any) => field.value = evt.target.value,
                    floatingLabelText: field.label,
                    defaultValue: field.value,
                    }));
        }
    });
}