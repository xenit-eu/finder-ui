import { DOM as _, createElement as __, ReactElement } from 'react';

export function  Preview (src: string) : ReactElement<any> { 
    return _.iframe({border: "0", src: src}); 
}

