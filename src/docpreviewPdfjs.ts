import { createElement as __, DOM as _, ReactElement } from "react";
//@Component DocPreviewPdfJs
//@ComponentDescription "Preview of a document (using the PDFJS library) Note: To use this component, the pdfjs library should be accessible at the following URL:  /alfresco/finder/pdfjs "
//@Method DocPreview Returns ReactComponent
//@MethodDescription "DocPreview({param1: value1, param2: value2, ...})"
//@Param src string "url of the document to be displayed"

export function DocPreviewPdfJs ({src}: {src: string}): ReactElement<any> {
    // the iframe is loaded with PdfJs library which is embedded in the jar which contains the web app (bundle.js)
    // example link to pdfjs lib: http://localhost:8080/alfresco/s/finder/resources/static/pdfjs/index.html (cfr project https://bitbucket.org/xenit/finder-ethias-de-amp)
    const pdsJsWrapperSrc = "/alfresco/s/finder/resources/static/pdfjs/index.html?file=" + src;
    return _.iframe({className: "pdfjs-container-iframe", border: "0", src: pdsJsWrapperSrc});
}
