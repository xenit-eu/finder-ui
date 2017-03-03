import { DOM as _, createElement as __ } from 'react';
import { Comment_t, newCommentCard, commentCards } from './comment';

export type CommentsPanel_t = {
    language: string,
    nbrOfComments: number, // To make React re-render when a deep change took place
    comments: Comment_t[],
    nrOfEditingComments: number, // To make React re-render when a deep change took place
    onSaveNewComment: (newComment: string) => void,
    onDeleteComment: (commentToDelete: Comment_t) => void,
    onStartEditing: (commentToEdit: Comment_t) => void,
    onSaveEditing: (updatedComment: Comment_t) => void,
    onCancelEditing: (canceledComment: Comment_t) => void
};

export function CommentsPanel({ language, nbrOfComments, comments, nrOfEditingComments, onSaveNewComment, onDeleteComment, onStartEditing, onSaveEditing, onCancelEditing }: CommentsPanel_t) {
    return _.div({ className: 'comments-panel' }, [
        _.div({ className: 'comments-content' },
            [
                newCommentCard(onSaveNewComment),
                ...commentCards(language, comments, onDeleteComment, onStartEditing, onSaveEditing, onCancelEditing)
            ])
    ]
    );
}
