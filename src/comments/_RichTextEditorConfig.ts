import type RichTextEditor from "react-rte";
type RTE_Props_t = RichTextEditor["props"];
type ToolbarConfig_t = NonNullable<RTE_Props_t["toolbarConfig"]>;
const toolbarConfig: ToolbarConfig_t = {
    display: ["INLINE_STYLE_BUTTONS", "BLOCK_TYPE_BUTTONS", "HISTORY_BUTTONS"],
    INLINE_STYLE_BUTTONS: [
        { label: "Bold", style: "BOLD" },
        { label: "Italic", style: "ITALIC" },
        { label: "Underline", style: "UNDERLINE" },
    ],
    BLOCK_TYPE_BUTTONS: [
        { label: "UL", style: "unordered-list-item" },
        { label: "OL", style: "ordered-list-item" },
    ],
    BLOCK_TYPE_DROPDOWN: [],

};

export { toolbarConfig };
