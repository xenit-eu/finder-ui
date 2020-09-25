import { action } from "@storybook/addon-actions";
import scoreStringSimilarity from "@xenit/finder-string-similarity-score";
import React from "react";
import TextComponent from "./Text";

export default {
    title: "searchbar/renderer/Text",
    component: TextComponent,
};

const text = "Some input text";

export const normal = () => <TextComponent value={text} />;

export const empty = () => <TextComponent value={null} />;

export const editable = () => <TextComponent value={text} onChange={action("change")} />;

export const highlighted = () => {
    const highlightString = "om text";
    const similarity = scoreStringSimilarity(highlightString, text);

    return <TextComponent value={text} similarity={similarity} />;
};
