
import { mount, shallow } from "enzyme";
import { Component, createElement as __, DOM as _, PropTypes } from "react";

import * as injectTapEventPlugin from "react-tap-event-plugin";
import { Fixture, simulateEvent } from "./testUtils";

import {Pager_t} from "./pager";
import { SearchBox, SearchBox_t } from "./searchbox";

// tslint:disable-next-line:no-var-requires
const jasmineEnzyme = require("jasmine-enzyme"); // no typings for jasmine-engine => require instead of import.

const ENTER_KEY_CODE: number = 13;

// !!!!! missing function in phantomjs !!!!!! 
if (!String.prototype.endsWith) {
  String.prototype.endsWith = (searchString, position) => {
      let subjectString = this.toString();
      if (typeof position !== "number" || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      let lastIndex = subjectString.lastIndexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
  };
}

describe("SearchBox component tests", () => {

    beforeAll(() => {
        injectTapEventPlugin();
    });
    beforeEach(() => {
        jasmineEnzyme();
    });

    it("should call onEnter callback with null param when enter key pressed without input text", () => {
        const props: SearchBox_t = {
            searching: false,
            terms: [],
            searchableTerms: [],
            onRemove: (idx) => {},
            onEnter: (text) => {},
            onInputChanged: () => {},
        };

        spyOn(props, "onEnter");

        const wrapper = Fixture(__(SearchBox, props));

        wrapper.find("input").simulate("keyUp", { keyCode: ENTER_KEY_CODE });
        expect(props.onEnter).toHaveBeenCalledWith(null);
    });

    it("should call onEnter with entered text when enter key pressed after entering text in input field", () => {
        const props: SearchBox_t = {
            searching: false,
            terms: [],
            searchableTerms: [{label: "name", name: "name_name", type: "text", values: []}],
            onRemove: (idx) => {},
            onEnter: (text) => {},
            onInputChanged: () => {},
        };

        spyOn(props, "onEnter");

        const wrapper = Fixture(__(SearchBox, props));

        const text = "name:value";
        const input: any = wrapper.find("input").get(0);
        input.value = text;

        wrapper.find("input").simulate("change");
        wrapper.find("input").simulate("keyUp", { keyCode: ENTER_KEY_CODE });
        expect(props.onEnter).toHaveBeenCalledWith({name: "name_name", label: "name", value: "value"});
    });

    it("should display provided list of terms in chips components", () => {
        const props: SearchBox_t = {
            searching: false,
            terms: [{
                name: "N1",
                label: "L1",
                value: "V1",
            }, {
                name: "N2",
                label: "L2",
                value: "V2",
            }],
            searchableTerms: [],
            onRemove: (idx) => {},
            onEnter: (text) => {},
            onInputChanged: () => {},
        };

        const wrapper = Fixture(__(SearchBox, props));

        expect(wrapper.find("Chip").length).toBe(props.terms.length);
        for (let i = 0; i < props.terms.length; i++) {
            expect(wrapper.find("Chip").at(i).text()).toBe(props.terms[i].label + ":" + props.terms[i].value);
        }

    });

    it("should call onRemove with index of removed item when deleting a specific term", () => {
        const props: SearchBox_t = {
            searching: false,
            terms: [{
                name: "N1",
                label: "L1",
                value: "V1",
            }, {
                name: "N2",
                label: "L2",
                value: "V2",
            }, {
                name: "N3",
                label: "L3",
                value: "V3",
            }],
            searchableTerms: [],
            onRemove: (idx) => {},
            onEnter: (text) => {},
            onInputChanged: () => {},
        };

        spyOn(props, "onRemove");

        const wrapper = Fixture(__(SearchBox, props));

        expect(wrapper.find("Chip").length).toBe(props.terms.length);

        const idxToDelete = 1;
        simulateEvent(wrapper.find("Chip").at(idxToDelete).find("NavigationCancel"), "touchTap");
        expect(props.onRemove).toHaveBeenCalledWith(idxToDelete);
    });

    it("should display the suggestion list", () => {
        const props: SearchBox_t = {
            searching: false,
            terms: [{
                name: "N1",
                label: "L1",
                value: "V1",
            }, {
                name: "N2",
                label: "L2",
                value: "V2",
            }, {
                name: "N3",
                label: "L3",
                value: "V3",
            }],
            searchableTerms: [{label: "aaa", name: "naaa", type: "text", values: []}, {label: "bbb", name: "nbbb", type: "text", values: []}],
            onRemove: (idx) => {},
            onEnter: (text) => {},
            onInputChanged: () => {},
        };

        spyOn(props, "onRemove");

        const wrapper = Fixture(__(SearchBox, props));

        for (let i = 0; i < props.searchableTerms.length; i++) {
            expect(wrapper.find("datalist option").at(i).text()).toBe(props.searchableTerms[i].label + ":");
        }
    });

});
