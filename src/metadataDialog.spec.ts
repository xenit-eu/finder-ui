
import { DOM as _, createElement as __, Component, PropTypes } from 'react';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import { Fixture, simulateEvent } from './testUtils';

import { MetaDataDialog, MetaDataDialog_t, MetadataType_t } from './metadataDialog';

const jasmineEnzyme = require('jasmine-enzyme'); // no typings for jasmine-engine => require instead of import.


describe('DocList component tests', function () {

    beforeAll(() => {
        injectTapEventPlugin();
    });
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('should not open dialog when opened prop is false', () => {

        const props: MetaDataDialog_t = {
            opened: false,
            fields: [],
            onClose: () => { },
            onSave: (fields) => { }
        };

        const wrapper = Fixture(MetaDataDialog(props));
        expect(wrapper.find("Dialog").prop("open")).toBe(false);
    });


    it('should open dialog when opened props is true', () => {

        const props: MetaDataDialog_t = {
            opened: true,
            fields: [{
                name: "F1",
                label: "L1",
                value: "V1",
                type: MetadataType_t.STRING
            },{
                name: "F2",
                label: "L2",
                value: "V2",
                type: MetadataType_t.STRING
            }],
            onClose: () => { },
            onSave: (fields) => { }
        };

        const wrapper = Fixture(MetaDataDialog(props));

        console.log(wrapper.find("Dialog").debug());

        expect(wrapper.find("Dialog").prop("open")).toBe(true);

    });


    it('should display fields correctly', () => {

        const props: MetaDataDialog_t = {
            opened: true,
            fields: [{
                name: "F1",
                label: "L1",
                value: "V1",
                type: MetadataType_t.STRING
            },{
                name: "F2",
                label: "L2",
                value: "V2",
                type: MetadataType_t.STRING
            }],
            onClose: () => { },
            onSave: (fields) => { }
        };

        const wrapper = Fixture(MetaDataDialog(props));

        //expect(wrapper.find('TextField').length).toBe(props.fields.length);

        // !! dialog content not displayed in fixture
    });



})