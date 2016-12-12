import { DOM as _, createElement as __, ReactElement } from 'react';

export function  DocPreviewPdfJs ({src} : {src: string}) : ReactElement<any> {
    // the iframe is loaded with PdfJs library which is embedded in the jar which contains the web app (bundle.js)
    const pdsJsWrapperSrc = "/alfresco/finder/pdfjs/index.html?file=" + src; 
    return _.iframe({className: 'pdfjs-container-iframe', border: "0", src: pdsJsWrapperSrc}); 
}

