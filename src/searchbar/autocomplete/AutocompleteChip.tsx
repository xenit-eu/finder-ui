import React, { useCallback } from "react";
import ResizableChip from "../chips/ResizableChip";
import FieldRenderer, { FieldRendererComponent, ISearchboxFieldData } from "../FieldRenderer";

type AutocompleteChip_Props_t<T, D extends ISearchboxFieldData<T>> = {
    readonly value: D,
    readonly viewComponent: FieldRendererComponent<T, {}>;
    readonly onSelect: () => void,
};

export default function AutocompleteChip<T, D extends ISearchboxFieldData<T>>(props: AutocompleteChip_Props_t<T, D>) {
    const label = <FieldRenderer data={props.value} component={props.viewComponent} componentProps={{}} />;
    const onClick = useCallback(() => props.onSelect(), [props.onSelect]);
    return <ResizableChip label={label} onClick={onClick} />;
}
