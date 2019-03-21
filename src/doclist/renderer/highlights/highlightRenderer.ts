import * as _ from "react-dom-factories";
import { ColumnRenderer_Config_t, ColumnRenderer_Factory_t, ColumnRenderer_Props_t, ColumnRenderer_t } from "../interface";
import { FieldHighlights_t, HighlightedTextPart_t } from "../../../metadata/fields";

function generateHtml(highlightInfo: HighlightedTextPart_t): any/*Whatever React function*/ {
    return highlightInfo.map((pair) => (pair.highlighted ? _.strong({}, pair.text) : _.span({}, pair.text)));
}

export const HighlightRenderer: ColumnRenderer_Factory_t<FieldHighlights_t[]> =
    (config: ColumnRenderer_Config_t<FieldHighlights_t[]>): ColumnRenderer_t => {
        return (props: ColumnRenderer_Props_t) => {
            let htmlGeneration: any[] = [];
            props.highlights.forEach((highlightDef) => {
                highlightDef.highlightInfos.forEach((highlightInfo) => {
                    htmlGeneration.push(_.span({}, " [...] "));
                    htmlGeneration.push(generateHtml(highlightInfo));
                    htmlGeneration.push(_.span({}, " [...] "));
                });
            });
            return _.span({ style: { "white-space": "normal", "fontSize": "x-small" } }, htmlGeneration);
        };
    };

export type highlightInfo = { text: string, highlighted: boolean }[];

export function splitHighlightSnippet(highlightString: string, prefix: string, postfix: string): string[] {
    let delimiterExpression: RegExp = new RegExp(prefix + "|" + postfix);
    let splitOnHighlightDelimiters: string[] = highlightString.split(delimiterExpression);
    return splitOnHighlightDelimiters;
}

export function toHighlightInfos(splitSnippets: string[]): highlightInfo {
    return splitSnippets.map((splitSnippet, i) => ({ text: splitSnippet, highlighted: i % 2 === 1 }));
}

export function parseHighlights(highlightString: string, prefix: string = "<em>", postfix: string = "</em>"): highlightInfo {
    return toHighlightInfos(splitHighlightSnippet(highlightString, prefix, postfix));
}
