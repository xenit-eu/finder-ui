import { createElement as __, DOM as _, ReactElement } from "react";

//@Component DocPreview
//@ComponentDescription "Preview of a document (using the browser capabilities to display PDF, JPG, PNG, Movies, ...)"
//@Method DocPreview Returns ReactComponent
//@MethodDescription "DocPreview({param1: value1, param2: value2, ...})"
//@Param src string "url of the document to be displayed"

export function  DocPreview ({src}: {src: string}): ReactElement<any> {
    return _.iframe({border: "0", src});
}
