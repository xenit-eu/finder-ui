import React, { useCallback } from "react";
import ResizableChip from "../chips/ResizableChip";
import FieldRenderer, { FieldRendererComponent, ISearchboxFieldData } from "../FieldRenderer";
import HighlightComponent from "../renderer/HighlightComponent";
import { RenderSimilarity, StringOrSimilarity } from "../Similarity";

type AutocompleteChip_Props_t<T, D extends ISearchboxFieldData<T>> = {
    readonly value: D,
    readonly customText?: StringOrSimilarity,
    readonly viewComponent: FieldRendererComponent<T, {}>;
    readonly onSelect: () => void,
};

export default function AutocompleteChip<T, D extends ISearchboxFieldData<T>>(props: AutocompleteChip_Props_t<T, D>) {
    const label = props.customText ?
        <RenderSimilarity text={props.customText} highlightComponent={HighlightComponent} /> :
        <FieldRenderer data={props.value} component={props.viewComponent} componentProps={{}} />;
    const onClick = useCallback(() => props.onSelect(), [props.onSelect]);
    return <ResizableChip label={label} onClick={onClick} />;
}
