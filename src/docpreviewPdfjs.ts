import { createElement as __, DOM as _, ReactElement } from "react";

export function DocPreviewPdfJs({src}: { src: string }): ReactElement<any> {
    if (!src || src.length === 0) {
        return _.div({ className: "PDFJS_Without_file" });
    }
    const pdsJsWrapperSrc = "/alfresco/s/finder/resources/static/pdfjs/index.html?file=" + encodeURIComponent(src);
    return _.iframe({ className: "pdfjs-container-iframe", border: "0", src: pdsJsWrapperSrc });
}
