
import { Component, createElement as __ } from "react";
import * as _ from "react-dom-factories";
import { Fixture, simulateEvent } from "./__tests/testUtils";
import { Comment_t } from "./comment";
import { CommentsDialog, CommentsDialog_t } from "./commentsDialog";

describe("Metadata component", () => {

    it("should not open dialog when opened prop is false", () => {

        const props: CommentsDialog_t = {
            language: "en",
            opened: false,
            comments: [],
            onClose: () => { },
            onSaveNewComment: (newComment: string) => { },
            onDeleteComment: (commentToDelete: Comment_t) => { },
            onStartEditing: (commentToEdit: Comment_t) => { },
            onSaveEditing: (updatedComment: Comment_t) => { },
            onCancelEditing: (canceledComment: Comment_t) => { },
        };

        const wrapper = Fixture(CommentsDialog(props));
        expect(wrapper.find("Dialog").prop("open")).toBe(false);
    });

});
