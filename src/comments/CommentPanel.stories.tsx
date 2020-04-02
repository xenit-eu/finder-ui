import { action } from "@storybook/addon-actions";
import { boolean } from "@storybook/addon-knobs";
import * as React from "react";
import { v4 } from "uuid";
import CommentPanel from "./CommentPanel";

export default {
    title: "comments/CommentPanel",
    component: CommentPanel,
};

const comments = [
    {
        author: "C. Norris",
        date: new Date(),
        body: "The Chuck Norris military unit was not used in the game Civilization 4, because a single Chuck Norris could defeat the entire combined nations of the world in one turn.",
        permissions: {
            editable: false,
            deletable: false,
        },
        state: {
            isEditing: false,
            isSaving: false,
        },
    },
    {
        author: "A. Einstein",
        date: new Date(),
        body: "E=MC2",
        permissions: {
            editable: true,
            deletable: true,
        },
        state: {
            isEditing: false,
            isSaving: false,
        },
    },
    {
        author: "C. Norris",
        date: new Date(),
        body: "Chuck Norris code does not have race conditions. It always wins!",
        permissions: {
            editable: true,
            deletable: false,
        },
        state: {
            isEditing: true,
            isSaving: false,
        },
    },
];

function CommentPanelWrapper() {
    const [commentState, dispatch] = React.useReducer((state, action) => {
        switch (action.type) {
            case "delete":
                return state.filter((c) => c.id !== action.payload.id);
            case "editStart":
            case "editEnd":
                return state.map((c) => c.id === action.payload.id ? { ...c, state: { ...c.state, isEditing: action.type === "editStart" } } : c);
            case "isSaving":
                return state.map((c) => c.id === action.payload.id ? { ...c, state: { ...c.state, isSaving: true } } : c);
            case "save":
                return state.map((c) => c.id === action.payload.id ? { ...c, body: action.newBody, state: { isEditing: false, isSaving: false } } : c);
            case "new":
                return state.concat([action.payload]);
            default:
                return state;
        }
    }, comments.map((c) => ({ ...c, id: v4() })));

    const [newCommentState, setNewComment] = React.useState({ isEditing: false, isSaving: false });

    return <CommentPanel
        comments={commentState}
        newComment={{
            ...newCommentState,
            onCreate: () => setNewComment({ isEditing: true, isSaving: false }),
            onCancel: () => setNewComment({ isEditing: false, isSaving: false }),
            onSave: (newBody) => {
                setNewComment({ isEditing: true, isSaving: true });
                const comment = {
                    id: v4(),
                    author: "Me",
                    date: new Date(),
                    body: newBody,
                    permissions: {
                        editable: true,
                        deletable: true,
                    },
                    state: {
                        isEditing: false,
                        isSaving: false,
                    },
                };
                setTimeout(() => {
                    dispatch({ type: "new", payload: comment });
                    setNewComment({ isEditing: false, isSaving: false });
                }, 1500);
            },
        }}
        newCommentFab={boolean("newCommentFab", false)}
        onCommentDelete={(comment) => dispatch({ type: "delete", payload: comment })}
        onCommentEdit={(comment) => dispatch({ type: "editStart", payload: comment })}
        onCommentEditCancel={(comment) => dispatch({ type: "editEnd", payload: comment })}
        onCommentSave={(comment, newBody) => {
            dispatch({ type: "isSaving", payload: comment });
            setTimeout(() => {
                dispatch({ type: "save", payload: comment, newBody });

            }, 2000);
        }}
    />;

}

export const interactive = () => <CommentPanelWrapper />;

interactive.story = {
    parameters: {
        storyshots: { disable: true },
    },
};

export const empty = () => <CommentPanel
    comments={[]}
    onCommentDelete={() => { }}
    onCommentEdit={() => { }}
    onCommentEditCancel={() => { }}
    onCommentSave={() => { }}
/>;

export const withItems = () => <CommentPanel
    comments={comments}
    onCommentDelete={action("commentDelete")}
    onCommentEdit={action("commentEdit")}
    onCommentEditCancel={action("commentEditCancel")}
    onCommentSave={action("commentSave")}
/>;

export const withNewComment = () => <CommentPanel
    newComment={{
        isEditing: false,
        isSaving: false,

        onCreate: action("newComment.create"),
        onCancel: action("newComment.cancel"),
        onSave: action("newComment.save"),
    }}
    comments={comments}
    onCommentDelete={action("commentDelete")}
    onCommentEdit={action("commentEdit")}
    onCommentEditCancel={action("commentEditCancel")}
    onCommentSave={action("commentSave")}
/>;

export const withNewCommentFab = () => <CommentPanel
    newComment={{
        isEditing: false,
        isSaving: false,

        onCreate: action("newComment.create"),
        onCancel: action("newComment.cancel"),
        onSave: action("newComment.save"),
    }}
    newCommentFab={true}
    comments={comments}
    onCommentDelete={action("commentDelete")}
    onCommentEdit={action("commentEdit")}
    onCommentEditCancel={action("commentEditCancel")}
    onCommentSave={action("commentSave")}
/>;
