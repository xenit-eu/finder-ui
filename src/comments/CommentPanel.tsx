import { Theme, WithStyles, withStyles } from "@material-ui/core/styles";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import * as React from "react";
import { IComment } from "./_BaseComment";
import Comment from "./Comment";
import EditableComment from "./EditableComment";
import NewComment, { NewComment_Props_t } from "./NewComment";
import NewCommentFab from "./NewCommentFab";

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
    newCommentFab?: true,
    comments: readonly C[],
    onCommentEdit: (comment: C) => void,
    onCommentSave: (comment: C, newBody: string) => void,
    onCommentEditCancel: (comment: C) => void,
    onCommentDelete: (comment: C) => void,
} & WithStyles<typeof styles>;

const styles = (theme: Theme) => ({
    root: {
        position: "relative",
    } as CSSProperties,
    commentList: {

    },
    commentItem: {
        marginTop: theme.spacing.unit / 2,
        marginBottom: theme.spacing.unit / 2,
    },
    newCommentFab: {
        position: "fixed",
        bottom: theme.spacing.unit,
        right: theme.spacing.unit,

    } as CSSProperties,
});

function CommentPanelList<C extends ICommentPanelComment>(props: CommentPanel_Props_t<C>) {
    if (props.comments.length === 0) {
        return null;
    }
    return <>
        {props.comments.map((comment, i) =>
            <div className={props.classes.commentItem}>
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
    </>;
}

function NewCommentItem<C extends ICommentPanelComment>(props: CommentPanel_Props_t<C>) {
    if (!props.newComment) {
        return null;
    }
    if (props.newCommentFab && !props.newComment.isEditing) {
        return null;
    }
    return <div className={props.classes.commentItem}>
        <NewComment {...props.newComment} />
    </div>;

}

function CommentPanelInternal<C extends ICommentPanelComment>(props: CommentPanel_Props_t<C>) {
    return <div className={props.classes.root}>
        <div className={props.classes.commentList}>
            <CommentPanelList {...props} />
            <NewCommentItem {...props} />
        </div>
        {props.newComment && props.newCommentFab && <div className={props.classes.newCommentFab}>
            <NewCommentFab
                {...props.newComment}
            />
        </div>}
    </div>;
}

export default withStyles(styles, { name: "FinderCommentPanel" })(CommentPanelInternal);
