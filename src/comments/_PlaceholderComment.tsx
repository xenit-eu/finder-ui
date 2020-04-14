import { LinearProgress } from "@material-ui/core";
import * as React from "react";
import BaseComment, { BaseComment_Props_t } from "./_BaseComment";

type PlaceholderComment_Props_t = Pick<BaseComment_Props_t, Exclude<keyof BaseComment_Props_t, "children">>;
export default function PlaceholderComment(props: PlaceholderComment_Props_t) {
    return <BaseComment {...props}>
        <LinearProgress />
    </BaseComment>;

}
