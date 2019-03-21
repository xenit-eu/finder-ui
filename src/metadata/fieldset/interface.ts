import { FieldsetSkeleton_t } from "../fields";

type RendererSpecificParameters_t = {[k: string]: any};
export type FieldsetRenderConfig_t = {
    label: string,
    parameters: RendererSpecificParameters_t,
};

export type FieldsetRenderer_t = (config: FieldsetRenderConfig_t) => FieldsetSkeleton_t;
