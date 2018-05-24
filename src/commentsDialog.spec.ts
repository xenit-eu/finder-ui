
import { Component, createElement as __ } from "react";
import * as _ from "react-dom-factories";
import * as injectTapEventPlugin from "react-tap-event-plugin";
import { Comment_t } from "./comment";
import { CommentsDialog, CommentsDialog_t } from "./commentsDialog";
import { Fixture, simulateEvent } from "./testUtils";

import { configure } from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

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
