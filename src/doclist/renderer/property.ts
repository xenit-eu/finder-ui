import {DOM as _} from "react";
import { ColumnRenderer_Config_t, ColumnRenderer_Factory_t, ColumnRenderer_Props_t, ColumnRenderer_t } from "./interface";

const PropertyRenderer: ColumnRenderer_Factory_t<string | string[]> = (config: ColumnRenderer_Config_t<string | string[]>): ColumnRenderer_t => {
    // tslint:disable-next-line:only-arrow-functions
    return function Property(props: ColumnRenderer_Props_t) {
        let value = config.mapToView(props.node);
        if(!Array.isArray(value)) {
            value = [value];
        }
        return _.span({}, value.join(", "));
    };
};
export default PropertyRenderer;
