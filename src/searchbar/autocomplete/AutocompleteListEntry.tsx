import { ListItem, ListItemText } from "@material-ui/core";
import React from "react";
import FieldRenderer, { FieldRendererComponent, ISearchboxFieldData } from "../FieldRenderer";
import HighlightComponent from "../renderer/HighlightComponent";
import { RenderSimilarity, StringOrSimilarity } from "../Similarity";

type AutocompleteListEntry_Props_t<T, D extends ISearchboxFieldData<T>> = {
    readonly value: D,
    readonly customText?: StringOrSimilarity,
    readonly viewComponent: FieldRendererComponent<T, {}>;
    readonly onSelect: () => void,
};

export default function AutocompleteListEntry<T, D extends ISearchboxFieldData<T>>(props: AutocompleteListEntry_Props_t<T, D>) {
    return <ListItem button={true} onClick={() => props.onSelect()}>
        <ListItemText>
            {props.customText ?
                <RenderSimilarity text={props.customText} highlightComponent={HighlightComponent} /> :
                <FieldRenderer data={props.value} component={props.viewComponent} componentProps={{}} />
            }
        </ListItemText>
    </ListItem>;
}
