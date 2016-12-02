import { DOM as _, createElement as __, ReactElement } from 'react';

export function  DocPreview ({src} : {src: string}) : ReactElement<any> { 
    return _.iframe({border: "0", src: src}); 
}

