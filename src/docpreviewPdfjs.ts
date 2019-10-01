import { createElement as __, ReactElement } from "react";
import * as _ from "react-dom-factories";

export function DocPreviewPdfJs({ src }: { src: string }): ReactElement<any> {
    if (!src || src.length === 0) {
        return _.div({ className: "PDFJS_Without_file" });
    }
    const pdfJsWrapperSrc = "resources/static/pdfjs/web/viewer.html?file=" + encodeURIComponent(src);
    return _.iframe({ className: "pdfjs-container-iframe", style: { border: "none" }, src: pdfJsWrapperSrc });
}
