import { ComponentType, ReactElement, ReactNode } from "react";

type Aspect_t = string;
type Type_t = string;
type Property_t = string[];

export type Node_t = {
    aspects: Aspect_t[];
    type: Type_t;
    properties: {[k: string]: Property_t};
};

export enum RenderMode {
    VIEW,
    CREATE,
    EDIT,
};

export type FieldSkeleton_Props_t = {
    node: Node_t,
    onChange: (node: Node_t) => void,
    renderMode: RenderMode,
};
export type FieldSkeleton_t = ComponentType<FieldSkeleton_Props_t>;

export type FieldsetSkeleton_Props_t = { fields: Array<{ label: string, value: ReactNode }> };
export type FieldsetSkeleton_t = ComponentType<FieldsetSkeleton_Props_t>;
