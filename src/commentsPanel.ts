// tslint:disable-next-line:ordered-imports
import { createElement as __ } from "react";
import * as _ from "react-dom-factories";
import { Comment_t, CommentCards, NewCommentCard } from "./comment";

export type CommentsPanel_t = {
    show: boolean,
    language: string,
    comments: Comment_t[],
    canAdd: boolean,
    onSaveNewComment: (newComment: string) => void,
    onDeleteComment: (commentToDelete: Comment_t) => void,
    onStartEditing: (commentToEdit: Comment_t) => void,
    onSaveEditing: (updatedComment: Comment_t) => void,
    onCancelEditing: (canceledComment: Comment_t) => void,
};

//@Component CommentsPanel
//@ComponentDescription "displays an editable list of comments + allows to add a new comment to the list"
//@Method CommentsPanel Returns ReactComponent
//@MethodDescription "CommentsPanel({param1: value1, param2: value2, ...})"
//@Param language string "language (code) to be used for date formatting. example: fr,de,nl,... cfr https://momentjs.com/docs/#/i18n/"
//@Param comments Comment_t[] "list of existing comments"
//@Param onSaveNewComment (newComment: string) => void "called when a new comment has been added"
//@Param onDeleteComment (commentToDelete: Comment_t) => void "called when a existing comment has been removed"
//@Param onStartEditing (commentToEdit: Comment_t) => void "called on request to edit existing comment"
//@Param onCancelEditing (canceledComment: Comment_t) => void "called on request to cancel the edition of a comment"
//@Param onSaveEditing (updatedComment: Comment_t) => void "called when an existing comment has been modified"

export function CommentsPanel({ show, language, comments,
    onSaveNewComment, onDeleteComment, onStartEditing, onSaveEditing, onCancelEditing, canAdd }: CommentsPanel_t) {
    return _.div({ className: "comments-panel" },
        _.div({ className: "comments-content" },
            show ? [
                canAdd ? __(NewCommentCard, { key: "newCommentCard", onSaveNewComment }) : undefined,
                ...CommentCards(language, comments, onDeleteComment, onStartEditing, onSaveEditing, onCancelEditing),
            ] : []),
    );
}
