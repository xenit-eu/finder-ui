import { createElement } from "react";
import { DropZone } from "./drop-zone";

export default {
    title: "DropZone",
    component: DropZone,
};

export const normal = () => createElement(DropZone, { process: () => { }, postProcessSelected: () => Promise.resolve(true) });
