import moment from "moment";
import * as _ from "react-dom-factories";
import { ColumnRenderer_Config_t, ColumnRenderer_Factory_t, ColumnRenderer_Props_t, ColumnRenderer_t } from "./interface";
import ResourceResolverRenderer from "./resource-resolver";

type Property_t = string | Date | boolean;

const PropertyRenderer: ColumnRenderer_Factory_t<Property_t | Property_t[]> = (config: ColumnRenderer_Config_t<Property_t | Property_t[]>): ColumnRenderer_t => {
    // If a resource resolver is given, always use the resource resolver renderer instead of a plain property
    // The plain property renderer will only show the underlying value that is not translated through a resource resolver
    if (config.parameters.resolver) {
        return ResourceResolverRenderer(<any>config);
    }
    // tslint:disable-next-line:only-arrow-functions
    return function Property(props: ColumnRenderer_Props_t) {
        let value = config.mapToView(props.node);
        const valueAsList = !Array.isArray(value) ? [value] : value;
        const stringRepresentation = valueAsList.map(v => convertToString(config.parameters, v)).join(", ");
        return _.span({ title: stringRepresentation }, stringRepresentation);
    };
};
export default PropertyRenderer;
/*We can use the metadata renderers of the metadata panel here instead of this function*/
function convertToString(parameters: { [k: string]: any }, value: Property_t) {
    if (typeof value === "string") {
        return value;
    }

    if (typeof value === "boolean") {
        return value ? "True" : "False";
    }

    if (value instanceof Date) {
        return moment(value).format(parameters["date-format"] || "Y/M/D");
    }

    return value;
}
