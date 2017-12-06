import { FieldSkeleton_t } from "../fields";

type Color_t = string;
export type PropertyRenderConfig_t = {
    label: string,
    description: string,
    backgroundColor: Color_t,
    foregroundColor: Color_t,
    help: string,
    id: string,
};

export type PropertyRenderer_t = (config: PropertyRenderConfig_t) => FieldSkeleton_t;
