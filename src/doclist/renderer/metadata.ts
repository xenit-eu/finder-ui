import { createElement as __, DOM as _ } from "react";

import { PropertyRenderConfig_t, PropertyRenderer_t, PropertyRenderers, RenderMode } from "../../metadata";
import { ColumnRenderer_Config_t, ColumnRenderer_Factory_t, ColumnRenderer_Props_t, ColumnRenderer_t } from "./interface";

function wrapMetadataRenderer<T>(metadataRendererFactory: PropertyRenderer_t<T>): ColumnRenderer_Factory_t<T> {
    return (config: ColumnRenderer_Config_t<T>): ColumnRenderer_t => {
        const metadataRenderer = metadataRendererFactory(config as PropertyRenderConfig_t<T>);
        return (props: ColumnRenderer_Props_t) => {
            return __(metadataRenderer, {
                node: props.node,
                onChange: () => {},
                renderMode: RenderMode.VIEW,
            });
        };
    };
}

export const Currency = wrapMetadataRenderer(PropertyRenderers.Currency);
export const Size = wrapMetadataRenderer(PropertyRenderers.Size);
export const Mimetype = wrapMetadataRenderer(PropertyRenderers.Mimetype);
