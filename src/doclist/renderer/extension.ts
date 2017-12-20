import { DOM as _ } from "react";
import { Node_t } from "../../metadata/fields";
import { ColumnRenderer_Config_t, ColumnRenderer_Factory_t, ColumnRenderer_Props_t, ColumnRenderer_t } from "./interface";
import PropertyRenderer from "./property";

const ExtensionRenderer: ColumnRenderer_Factory_t<string> = (config: ColumnRenderer_Config_t<string>): ColumnRenderer_t => {
    return PropertyRenderer({
        ...config,
        mapToView: (node: Node_t) => config.mapToView(node).split(".").slice(-1)[0],
    });
};

export default ExtensionRenderer;
