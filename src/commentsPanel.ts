// tslint:disable-next-line:ordered-imports
import { createElement as __, DOM as _ } from "react";
import { Comment_t, commentCards, newCommentCard } from "./comment";

export type CommentsPanel_t = {
    language: string,
    comments: Comment_t[],
    onSaveNewComment: (newComment: string) => void,
    onDeleteComment: (commentToDelete: Comment_t) => void,
    onStartEditing: (commentToEdit: Comment_t) => void,
    onSaveEditing: (updatedComment: Comment_t) => void,
    onCancelEditing: (canceledComment: Comment_t) => void,
};

export function CommentsPanel({ language, comments,
                onSaveNewComment, onDeleteComment, onStartEditing, onSaveEditing, onCancelEditing }: CommentsPanel_t) {
    return _.div({ className: "comments-panel" }, [
        _.div({ className: "comments-content" },
            [
                newCommentCard(onSaveNewComment),
                ...commentCards(language, comments, onDeleteComment, onStartEditing, onSaveEditing, onCancelEditing),
            ]),
    ],
    );
}
