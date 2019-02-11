import { createElement as __, ReactNode } from "react";

import { ColumnRenderer_Config_t, ColumnRenderer_Factory_t, ColumnRenderer_Props_t, ColumnRenderer_t } from "./interface";

export type Highlight_t = string;

const HighlightRenderer: ColumnRenderer_Factory_t<Highlight_t[]> = (config: ColumnRenderer_Config_t<Highlight_t[]>): ColumnRenderer_t => {
    return function Highlight(props: ColumnRenderer_Props_t) {
        return __("span", [], null);
    };
};

export default HighlightRenderer;
