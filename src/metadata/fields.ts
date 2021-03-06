import { ComponentType, ReactElement, ReactNode } from "react";

type Aspect_t = string;
type Type_t = string;
type Property_t = string[];

export type SearchHit_t = {
    node: Node_t;
    highlights: FieldHighlights_t[];
};

export type Node_t = {
    aspects: Aspect_t[];
    type: Type_t;
    properties: {[k: string]: Property_t};
};

export type FieldHighlights_t = {
    field: string;
    highlightInfos: HighlightedTextPart_t[];
};

export type HighlightedTextPart_t = Array<{
    text: string;
    highlighted: boolean;
}>;

export enum RenderMode {
    VIEW,
    CREATE,
    EDIT,
};

export type FieldSkeleton_Props_t = {
    node: Node_t[],
    onChange: (node: Node_t[]) => void,
    renderMode: RenderMode,
};
export type FieldSkeleton_t = ComponentType<FieldSkeleton_Props_t>;

export type FieldsetSkeleton_Props_t = { fields: Array<{ label: ReactNode, value: ReactNode }> };
export type FieldsetSkeleton_t = ComponentType<FieldsetSkeleton_Props_t>;
