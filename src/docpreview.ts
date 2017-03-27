import { createElement as __, DOM as _, ReactElement } from "react";

export function  DocPreview ({src}: {src: string}): ReactElement<any> {
    return _.iframe({border: "0", src});
}
