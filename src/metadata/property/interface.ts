import { FieldSkeleton_t, Node_t } from "../fields";

export type ModelToViewMapper_t = (node: Node_t) => string;
export type ViewToModelMapper_t = (node: Node_t, s: string) => Node_t;
type Color_t = string;
export type PropertyRenderConfig_t = {
    label: string,
    description: string,
    backgroundColor: Color_t,
    foregroundColor: Color_t,
    help: string,
    mapToView: ModelToViewMapper_t,
    mapToModel: ViewToModelMapper_t,
};

export type PropertyRenderer_t = (config: PropertyRenderConfig_t) => FieldSkeleton_t;
