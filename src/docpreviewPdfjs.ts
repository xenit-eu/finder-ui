import { createElement as __, DOM as _, ReactElement } from "react";

export function DocPreviewPdfJs ({src}: {src: string}): ReactElement<any> {
    // the iframe is loaded with PdfJs library which is embedded in the jar which contains the web app (bundle.js)
    // example link to pdfjs lib: http://localhost:8080/alfresco/s/finder/resources/static/pdfjs/index.html (cfr project https://bitbucket.org/xenit/finder-ethias-de-amp)
    const pdsJsWrapperSrc = "/alfresco/s/finder/resources/static/pdfjs/index.html?file=" + src;
    return _.iframe({className: "pdfjs-container-iframe", border: "0", src: pdsJsWrapperSrc});
}
