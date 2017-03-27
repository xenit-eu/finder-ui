
import { Component, createElement as __, DOM as _, PropTypes } from "react";
import * as injectTapEventPlugin from "react-tap-event-plugin";
import { Comment_t } from "./comment";
import { CommentsDialog, CommentsDialog_t } from "./commentsDialog";
import { Fixture, simulateEvent } from "./testUtils";

// tslint:disable-next-line:no-var-requires
const jasmineEnzyme = require("jasmine-enzyme"); // no typings for jasmine-engine => require instead of import.

describe("Metadata component", () => {

    beforeAll(() => {
        injectTapEventPlugin();
    });
    beforeEach(() => {
        jasmineEnzyme();
    });

    it("should not open dialog when opened prop is false", () => {

        const props: CommentsDialog_t = {
            language: "en-us",
            opened: false,
            comments: [],
            onClose: () => {},
            onSaveNewComment: (newComment: string) => {},
            onDeleteComment: (commentToDelete: Comment_t) => {},
            onStartEditing: (commentToEdit: Comment_t) => {},
            onSaveEditing: (updatedComment: Comment_t) => {},
            onCancelEditing: (canceledComment: Comment_t) => {},
        };

        const wrapper = Fixture(CommentsDialog(props));
        expect(wrapper.find("Dialog").prop("open")).toBe(false);
    });

});
