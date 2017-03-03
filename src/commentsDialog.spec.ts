
import { DOM as _, createElement as __, Component, PropTypes } from 'react';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import { Fixture, simulateEvent } from './testUtils';

import { Comment_t } from './comment';
import { CommentsDialog_t, CommentsDialog } from './commentsDialog';

const jasmineEnzyme = require('jasmine-enzyme'); // no typings for jasmine-engine => require instead of import.


describe('Metadata component', function () {

    beforeAll(() => {
        injectTapEventPlugin();
    });
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('should not open dialog when opened prop is false', () => {

        const props: CommentsDialog_t = {
            language: "en-us",
            opened: false,
            nbrOfComments: 0,
            comments: [],
            nrOfEditingComments: 0,
            onClose: () => {},
            onSaveNewComment: (newComment: string) => {},
            onDeleteComment: (commentToDelete: Comment_t) => {},
            onStartEditing: (commentToEdit: Comment_t) => {},
            onSaveEditing: (updatedComment: Comment_t) => {},
            onCancelEditing: (canceledComment: Comment_t) => {}
        };

        const wrapper = Fixture(CommentsDialog(props));
        expect(wrapper.find("Dialog").prop("open")).toBe(false);
    });

});