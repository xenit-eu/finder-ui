import { Card, CardContent, CardHeader, IconButton, ListItemIcon, ListItemText, MenuItem, Typography } from "@material-ui/core";
import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import MoreVert from "@material-ui/icons/MoreVert";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { OverflowMenu } from "../menu";

interface IComment {
    author: string;
    date: Date;
    body: string;

}
type Comment_Props_t = {
    comment: IComment,
    onDelete?: () => void,
    onEdit?: () => void,
};
export default function Comment(props: Comment_Props_t) {
    const { t } = useTranslation("finder-ui");
    return <Card>
        <CardHeader
            title={props.comment.author}
            titleTypographyProps={{
                variant: "body2",
            }}
            subheader={t("comments/Comment/date", props.comment.date)}
            action={<CommentActions {...props} />}
        />
        <CardContent>
            <Typography paragraph>{props.comment.body}</Typography>
        </CardContent>
    </Card>;
}

function CommentActions(props: Comment_Props_t) {
    const actions = [] as Array<{
        label: string,
        icon: React.ReactElement,
        action: () => void,
    }>;
    if (props.onEdit) {
        actions.push({
            label: "edit",
            icon: <Edit />,
            action: props.onEdit,
        });
    }
    if (props.onDelete) {
        actions.push({
            label: "delete",
            icon: <Delete />,
            action: props.onDelete,
        });
    }
    const { t } = useTranslation("finder-ui");

    return <OverflowMenu
        items={actions.map((action) => ({
            label: t("comments/Comment/" + action.label),
            icon: action.icon,
            onClick: action.action,
        }))}
        maxItems={1}
        menuIcon={<MoreVert />}
    />;
}
