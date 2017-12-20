import { ComponentType } from "react";
import { ModelToViewMapper_t, Node_t } from "../../metadata";

export type ColumnRenderer_Props_t = {
    node: Node_t,
    row: number,
};

export type ColumnRenderer_t = ComponentType<ColumnRenderer_Props_t>;

type RendererSpecificParameters_t = { [k: string]: any };
export type ColumnRenderer_Config_t<T> = {
    parameters: RendererSpecificParameters_t,
    mapToView: ModelToViewMapper_t<T>,
};

export type ColumnRenderer_Factory_t<T> = (config: ColumnRenderer_Config_t<T>) => ColumnRenderer_t;
