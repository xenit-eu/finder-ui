import { FieldSkeleton_t, Node_t } from "../fields";

class MultipleValuesMarkerObject {
    // tslint:disable-next-line:variable-name
    private __multipleValuesMarker__ = true;
}

export const MultipleValuesMarker = new MultipleValuesMarkerObject();
// tslint:disable-next-line:type-name
export type MultipleValuesMarker = MultipleValuesMarkerObject;
export type ModelToViewMapper_t<T> = (node: Node_t[]) => T | MultipleValuesMarker;
export type ViewToModelMapper_t<T> = (node: Node_t[], s: T) => Node_t[];
type Color_t = string;

type RendererSpecificParameters_t = {[k: string]: any};
export type PropertyRenderConfig_t<T> = {
    label: string,
    description: string,
    backgroundColor: Color_t,
    foregroundColor: Color_t,
    help: string,
    parameters: RendererSpecificParameters_t,
    mapToView: ModelToViewMapper_t<T>,
    mapToModel: ViewToModelMapper_t<T>,
};

export type PropertyRenderer_t<T> = (config: PropertyRenderConfig_t<T>) => FieldSkeleton_t;
