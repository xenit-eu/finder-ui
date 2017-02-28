
import { DOM as _, createElement as __, Component, PropTypes } from 'react';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import { Fixture, simulateEvent } from './testUtils';

import { MetadataType_t } from './metadata';
import { MetaDataDialog, MetaDataDialog_t } from './metadataDialog';

const jasmineEnzyme = require('jasmine-enzyme'); // no typings for jasmine-engine => require instead of import.


describe('Metadata component', function () {

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

        //console.log(wrapper.find("Dialog").debug());

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
        const layerWrapper = Fixture(wrapper.find("RenderToLayer").prop('render')()); // render the popup menu layer content !

        expect(layerWrapper.find('TextField').length).toBe(props.fields.length);

    });

    it('should return all the metadata (with modified ones) when pushing the "save" button', () => {

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

        spyOn(props, "onSave");

        const wrapper = Fixture(MetaDataDialog(props));
        const layerWrapper = Fixture(wrapper.find("RenderToLayer").prop('render')()); // render the popup menu layer content !

        const inputIdx = 1, inputText = "ABC";

        // change value of input.
        const textField = layerWrapper.find('TextField').at(inputIdx);
        const input : any = textField.find('input');
        input.value = inputText;
        //textField.simulate('change');
        textField.prop("onChange")({target: {value: inputText}});


        // simulate a click on save button.
        const saveButton = layerWrapper.find("FlatButton").at(1); // second button is save button 
        simulateEvent(saveButton, "touchTap");

        expect(props.onSave).toHaveBeenCalledWith([{
                name: "F1",
                label: "L1",
                value: "V1",
                type: MetadataType_t.STRING
            },{
                name: "F2",
                label: "L2",
                value: inputText,
                type: MetadataType_t.STRING
            }]);

    });


});