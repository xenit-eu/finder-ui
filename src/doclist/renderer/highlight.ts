import { createElement as __, ReactNode } from "react";

import { ColumnRenderer_Config_t, ColumnRenderer_Factory_t, ColumnRenderer_Props_t, ColumnRenderer_t } from "./interface";

/*export*/ type Highlight_t = string;


//TODO Remove this class since its been replaced by one in finder-xenit
//because fuck consistency?

const HighlightRenderer: ColumnRenderer_Factory_t<Highlight_t[]> = (config: ColumnRenderer_Config_t<Highlight_t[]>): ColumnRenderer_t => {
    return function Highlight(props: ColumnRenderer_Props_t) {
        let htmlGeneration: any[] = [];
        props.highlights.forEach((highlightItem) => {
            // One highlightInfo per snippet
            highlightItem.snippets.forEach((snippet) => {
                // Somehow the whole highlight shebang from finder-xenit needs to come in here,
                // so we can have those juicy, juicy highlightInfos,
                // which can then be poured into html.
                
                let highlightInfo/*:highlightInfo = parseHighlights(snippet)*/;
                let highlightHtmlForNode = generateHtml(highlightInfo);
                htmlGeneration.push(highlightHtmlForNode);
            });
        });
        return __("span", [], htmlGeneration);
    };
};

function generateHtml(highlightInfo: any/*highlightInfo*/): any/*Whatever React function*/{
    return highlightInfo.map((pair:{text:string, highlighted:boolean}) => (
        pair.highlighted ? __("bold", [], pair.text) : __("text", [], pair.text)
    ));
}

//export default HighlightRenderer;
