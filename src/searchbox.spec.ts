
import { mount, shallow } from 'enzyme';
import { DOM as _, createElement as __, Component, PropTypes } from 'react';

import * as injectTapEventPlugin from 'react-tap-event-plugin';
import { Fixture, simulateEvent } from './testUtils';

import { SearchBox, SearchBox_t } from './searchbox';
import {Pager_t} from './pager';

const jasmineEnzyme = require('jasmine-enzyme'); // no typings for jasmine-engine => require instead of import.

const ENTER_KEY_CODE = 13;


describe('SearchBox component tests', function () {

    beforeAll(() => {
        injectTapEventPlugin();
    });
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('should call onEnter callback with empty string when enter key pressed without input text', () => {
        const props : SearchBox_t = {
            searching: false,
            terms: [],
            suggestionList: [],
            onRemove: (idx) => {}, 
            onEnter: (text) => {}
        };

        spyOn(props, 'onEnter');

        const wrapper = Fixture(SearchBox(props));

        wrapper.find('input').simulate('keyUp', { keyCode: ENTER_KEY_CODE });
        expect(props.onEnter).toHaveBeenCalledWith("");
    });

    it('should call onEnter with entered text when enter key pressed after entering text in input field', () => {
        const props : SearchBox_t = {
            searching: false,
            terms: [],
            suggestionList: [],
            onRemove: (idx) => {}, 
            onEnter: (text) => {}
        };

        spyOn(props, 'onEnter');

        const wrapper = Fixture(SearchBox(props));

        const text = 'name:value';

        const input : any = wrapper.find('input').get(0);
        input.value = text;

        wrapper.find('input').simulate('keyUp', { keyCode: ENTER_KEY_CODE });
        expect(props.onEnter).toHaveBeenCalledWith(text);
    });

    it('should display provided list of terms in chips components', () => {
        const props : SearchBox_t = {
            searching: false,
            terms: [{
                name: "N1",
                label: "L1",
                value: "V1"
            },{
                name: "N2",
                label: "L2",
                value: "V2"
            }],
            suggestionList: [],
            onRemove: (idx) => {}, 
            onEnter: (text) => {}
        };

        const wrapper = Fixture(SearchBox(props));

        expect(wrapper.find('Chip').length).toBe(props.terms.length);
        for (let i = 0; i < props.terms.length; i++) {
            expect(wrapper.find('Chip').at(i).text()).toBe(props.terms[i].label + ":" + props.terms[i].value);
        }

    });


    it('should call onRemove with index of removed item when deleting a specific term', () => {
        const props : SearchBox_t = {
            searching: false,
            terms: [{
                name: "N1",
                label: "L1",
                value: "V1"
            },{
                name: "N2",
                label: "L2",
                value: "V2"
            },{
                name: "N3",
                label: "L3",
                value: "V3"
            }],
            suggestionList: [],
            onRemove: (idx) => {}, 
            onEnter: (text) => {}
        };

        spyOn(props, 'onRemove');

        const wrapper = Fixture(SearchBox(props));

        expect(wrapper.find('Chip').length).toBe(props.terms.length);
        
        const idxToDelete = 1;
        simulateEvent(wrapper.find('Chip').at(idxToDelete).find('NavigationCancel'), 'touchTap');
        expect(props.onRemove).toHaveBeenCalledWith(idxToDelete);
    });

    it('should display the suggestion list', () => {
        const props : SearchBox_t = {
            searching: false,
            terms: [{
                name: "N1",
                label: "L1",
                value: "V1"
            },{
                name: "N2",
                label: "L2",
                value: "V2"
            },{
                name: "N3",
                label: "L3",
                value: "V3"
            }],
            suggestionList: ["aaa", "bbb"],
            onRemove: (idx) => {}, 
            onEnter: (text) => {}
        };

        spyOn(props, 'onRemove');

        const wrapper = Fixture(SearchBox(props));

        for (let i = 0; i < props.suggestionList.length; i++) {
            expect(wrapper.find('datalist option').at(i).text()).toBe(props.suggestionList[i] + ':');
        }
    });


});