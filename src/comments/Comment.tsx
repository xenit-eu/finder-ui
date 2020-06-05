import { Typography } from "@material-ui/core";
import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import MoreVert from "@material-ui/icons/MoreVert";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { OverflowMenu } from "../menu";
import BaseComment, { IComment } from "./_BaseComment";

const BodyRenderer = React.lazy(() => import("./_HTMLBodyRenderer"));

type Comment_Props_t = {
    comment: IComment,
    onDelete?: () => void,
    onEdit?: () => void,
};
export default function Comment(props: Comment_Props_t) {
    return <BaseComment
        comment={props.comment}
        headerAction={<CommentActions {...props} />}
    >
        <BodyRenderer>{props.comment.body}</BodyRenderer>
    </BaseComment>;
}

function CommentActions(props: Comment_Props_t) {
    const actions = [] as Array<{
        label: string,
        icon: React.ReactElement,
        action: () => void,
    }>;
    const { t } = useTranslation("finder-ui");
    if (props.onEdit) {
        actions.push({
            label: t("comments/Comment/edit"),
            icon: <Edit />,
            action: props.onEdit,
        });
    }
    if (props.onDelete) {
        actions.push({
            label: t("comments/Comment/delete"),
            icon: <Delete />,
            action: props.onDelete,
        });
    }

    return <OverflowMenu
        items={actions.map((action) => ({
            label: action.label,
            icon: action.icon,
            onClick: action.action,
        }))}
        maxItems={1}
    />;
}
