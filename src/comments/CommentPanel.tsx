import { Theme, WithStyles, withStyles } from "@material-ui/core/styles";
import * as React from "react";
import { IComment } from "./BaseComment";
import Comment from "./Comment";
import EditableComment from "./EditableComment";
import NewComment, { NewComment_Props_t } from "./NewComment";

export interface ICommentPanelComment extends IComment {
    readonly permissions: {
        readonly editable: boolean,
        readonly deletable: boolean,
    };

    readonly state: {
        readonly isEditing: boolean,
        readonly isSaving: boolean,
    };
}

type CommentPanel_Props_t<C extends ICommentPanelComment> = {
    newComment?: NewComment_Props_t,
    comments: readonly C[],
    onCommentEdit: (comment: C) => void,
    onCommentSave: (comment: C, newBody: string) => void,
    onCommentEditCancel: (comment: C) => void,
    onCommentDelete: (comment: C) => void,
} & WithStyles<typeof styles>;

const styles = (theme: Theme) => ({
    root: {

    },
    comment: {
        margin: theme.spacing.unit / 2,
    },
});

function CommentPanelInternal<C extends ICommentPanelComment>(props: CommentPanel_Props_t<C>) {
    if (props.comments.length === 0) {
        return null;
    }

    return <div className={props.classes.root}>
        {props.comments.map((comment, i) =>
            <div className={props.classes.comment}>
                {comment.state.isEditing ? <EditableComment
                    key={i}
                    comment={comment}
                    isSaving={comment.state.isSaving}
                    onSave={(newBody: string) => props.onCommentSave(comment, newBody)}
                    onCancel={() => props.onCommentEditCancel(comment)}
                /> : <Comment
                        key={i}
                        comment={comment}
                        onDelete={comment.permissions.deletable ? () => props.onCommentDelete(comment) : undefined}
                        onEdit={comment.permissions.editable ? () => props.onCommentEdit(comment) : undefined}
                    />}
            </div>,
        )}
        {props.newComment && <div className={props.classes.comment}>
            <NewComment {...props.newComment} />
        </div>}
    </div>;
}

export default withStyles(styles, { name: "FinderCommentPanel" })(CommentPanelInternal);
