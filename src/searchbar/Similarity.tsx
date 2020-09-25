import { SimilarityResult } from "@xenit/finder-string-similarity-score";
import debug from "debug";
import React from "react";

const d = debug("finder-ui:searchbar:Similarity");

export type StringOrSimilarity = string | SimilarityResult;

export function isSimilarity(o: StringOrSimilarity): o is SimilarityResult {
    return typeof o === "object" && "score" in o && "chunks" in o;
}

export function toSimilarity(o: StringOrSimilarity): SimilarityResult {
    if (isSimilarity(o)) {
        return o;
    }
    return {
        score: 0,
        chunks: [
            {
                text: o,
                matched: false,
            },
        ],
    };
}

type RenderHighlights_Props_t = {
    readonly text: StringOrSimilarity,
    readonly highlightComponent: React.ComponentType,
};

function fixText(text: string): string {
    // Replace spaces with non-breaking spaces, so spaces that end up at the start or end of an HTML tag are not swallowed.
    return text.replace(/ /g, "\xa0");
}

export function RenderSimilarity(props: RenderHighlights_Props_t) {
    const similarity = toSimilarity(props.text);
    const debugInfo = d.enabled ? <i style={{outline: "1px dashed deeppink"}}>(Score: {similarity.score})</i> : null;
    return <>{similarity.chunks.map((chunk, i) => chunk.matched ?
        <props.highlightComponent key={i}>{fixText(chunk.text)}</props.highlightComponent> :
        <span key={i}>{fixText(chunk.text)}</span>)
    }{debugInfo}</>;
}
