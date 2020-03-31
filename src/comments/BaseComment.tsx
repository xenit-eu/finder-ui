import { Card, CardActions, CardContent, CardHeader } from "@material-ui/core";
import * as React from "react";
import { useTranslation } from "react-i18next";
export interface IComment {
    author: string;
    date: Date;
    body: string;

}

type BaseComment_Props_t = {
    comment: IComment,
    headerAction?: React.ReactElement,
    children: React.ReactNode,
    footerAction?: React.ReactElement,
};
export default function BaseComment(props: BaseComment_Props_t) {
    const { t } = useTranslation("finder-ui");
    return <Card>
        <CardHeader
            title={props.comment.author}
            titleTypographyProps={{
                variant: "body2",
            }}
            subheader={t("comments/BaseComment/date", props.comment.date)}
            action={props.headerAction}
        />
        <CardContent>
            {props.children}
        </CardContent>
        {props.footerAction && <CardActions>{props.footerAction}</CardActions>}
    </Card>;
}
