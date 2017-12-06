import { FieldsetSkeleton_t } from "../fields";

export type FieldsetRenderConfig_t = {
    label: string,
    expandable: boolean,
};

export type FieldsetRenderer_t = (config: FieldsetRenderConfig_t) => FieldsetSkeleton_t;
