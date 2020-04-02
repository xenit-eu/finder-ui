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
