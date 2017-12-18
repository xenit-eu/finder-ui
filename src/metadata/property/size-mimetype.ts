import { Component, createElement as __, DOM as _, FormEvent, ReactElement } from "react";

import * as filesize from "filesize";
import { FieldSkeleton_Props_t, Node_t } from "../fields";
import { PropertyRenderConfig_t, PropertyRenderer_t } from "./interface";
import Label from "./label";

type Content_t = {
    contentUrl: string,
    mimetype: string,
    size: string,
    encoding: string,
    locale: string,
    id: string,
};

function convertToHumanReadable(size: string): string {
    if (!size) {
        return "";
    }
    let numSize = Number.parseInt(size);
    if(isNaN(numSize)) {
        return "";
    }
    return filesize(numSize);
}

export const Size: PropertyRenderer_t<Content_t | null> = (config: PropertyRenderConfig_t<Content_t | null>) => {
    return Label({
        ...config,
        mapToModel: (node: Node_t, value: string) => config.mapToModel(node, null),
        mapToView: (node: Node_t) => {
            let value = config.mapToView(node);
            return value ? convertToHumanReadable(value.size) : "";
        },
    });
};

export const Mimetype: PropertyRenderer_t<Content_t | null> = (config: PropertyRenderConfig_t<Content_t | null>) => {
    return Label({
        ...config,
        mapToModel: (node: Node_t, value: string) => config.mapToModel(node, null),
        mapToView: (node: Node_t) => {
            let value = config.mapToView(node);
            return value ? value.mimetype : "";
        },
    });
};
