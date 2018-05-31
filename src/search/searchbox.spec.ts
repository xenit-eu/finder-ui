import "core-js";
import { mount, shallow } from "enzyme";
import "es6-shim";
import {
    Component,
    createElement as __,
    DOM as _,
    PropTypes,
} from "react";
import * as injectTapEventPlugin from "react-tap-event-plugin";
import { Fixture, simulateEvent } from "./../testUtils";
import { AllSearchable, ISimpleSearchableQueryElement, TextSearchable } from "./searchables";
import { SearchBox, SearchBox_t } from "./searchbox";
import { ISimpleSearchQueryElement, StringValuePropertySearchQueryElement } from "./searchquery";
// tslint:disable-next-line:no-var-requires
const jasmineEnzyme = require("jasmine-enzyme"); // no typings for jasmine-engine => require instead of import.
const debug: any = require("debug");

const ENTER_KEY_CODE: number = 13;
export function dummyPropertyService() {
    return {
        translatePropertyKeyDebugDirect: (k: string) => "TRANSLATEKEY" + k,
        translatePropertyValueDebugDirect: (k: string) => "TRANSLATEVALUE" + k,
        translatePropertyKey: (k: string) => Promise.resolve("TRANSLATEKEY" + k),
        translatePropertyValue: (k: string, v: string) => Promise.resolve("TRANSLATEVALUE" + v),
    };
}

describe("SearchBox component tests", () => {

    beforeAll(() => {
        injectTapEventPlugin();
    });
    beforeEach(() => {
        jasmineEnzyme();
    });

    function SearchboxViaSearchablesProps(searchables: ISimpleSearchableQueryElement[], queryElements: ISimpleSearchQueryElement[]) {
        const retProps: SearchBox_t = {
            searching: false,
            searchedQueryElements: queryElements,
            searchableQueryElements: searchables,
            onRemoveQueryElement: (idx) => { },
            onAddQueryElement: (idx) => { },
            onSearch: () => { },
            onInputChanged: () => { },
            onSaveAsQuery: () => { },
            updateChipsOnConstruction: true,
        };
        return retProps;
    }
    it("should call onSearch callback when enter key pressed without input text", (done) => {
        const props = SearchboxViaSearchablesProps([], []);
        spyOn(props, "onSearch");
        const wrapper = Fixture(__(SearchBox, props));
        wrapper.find("input").simulate("keyUp", { keyCode: ENTER_KEY_CODE });
        expect(props.onSearch).toHaveBeenCalled();
        done();

    });

    it("should call onAddQueryElement with entered text when enter key pressed after entering text in input field", (done) => {
        const inlineExpect = expect;
        let props = SearchboxViaSearchablesProps([new TextSearchable("name", (s) => Promise.resolve(s))], []);
        props.onAddQueryElement = (idx) => {
            done();
        };
        const wrapper = Fixture(__(SearchBox, props));
        const text = "text:name";
        const input: any = wrapper.find("input").get(0);
        input.value = text;

        wrapper.find("input").simulate("change");
        wrapper.find("input").simulate("keyUp", { keyCode: ENTER_KEY_CODE });
    });

    it("should make a chip of a query with only value when there is an allsearchable ", (done) => {
        const inlineExpect = expect;
        let props = SearchboxViaSearchablesProps([new AllSearchable((s) => Promise.resolve(s))], []);
        props.onAddQueryElement = (idx) => {
            done();
        };
        const wrapper = Fixture(__(SearchBox, props));
        const text = "name";
        const input: any = wrapper.find("input").get(0);
        input.value = text;

        wrapper.find("input").simulate("change");
        wrapper.find("input").simulate("keyUp", { keyCode: ENTER_KEY_CODE });
    });

    it("should display provided list of terms in chips components", (done) => {
        const qE: StringValuePropertySearchQueryElement[] =
            [new StringValuePropertySearchQueryElement("dummy1", "dummy2", dummyPropertyService()), new StringValuePropertySearchQueryElement("dummy3", "dummy4", dummyPropertyService())];
        let props = SearchboxViaSearchablesProps([new AllSearchable((s) => Promise.resolve(s))], qE);
        props.onChipsUpdated = () => {
            expect(wrapper.find("Chip").length).toBe(qE.length);
            Promise.all(qE.map((q, i) => q.getSimpleSearchbarText()
                .then(ssT => expect(wrapper.find("Chip").at(i).text()).toBe(ssT))))
                .then(theTestIs => done())
                .catch((e) => { console.error(e); fail(); });
        };
        const wrapper = Fixture(__(SearchBox, props));
    });

    it("should call onRemoveTerm with index of removed item when deleting a specific term", (done) => {
        const qE: StringValuePropertySearchQueryElement[] =
            [new StringValuePropertySearchQueryElement("dummy1", "dummy2", dummyPropertyService()), new StringValuePropertySearchQueryElement("dummy3", "dummy4", dummyPropertyService())];
        let props = SearchboxViaSearchablesProps([new AllSearchable((s) => Promise.resolve(s))], qE);
        props.onChipsUpdated = () => {
            expect(wrapper.find("Chip").length).toBe(qE.length);
            Promise.all(qE.map((q, i) => q.getSimpleSearchbarText()
                .then(ssT => expect(wrapper.find("Chip").at(i).text()).toBe(ssT))))
                .catch((e) => { console.error(e); fail(); })
                .then(() => {
                    const onrequestDelete = <any>wrapper.find("Chip").at(1).prop("onRequestDelete");
                    onrequestDelete();
                }).catch(e => {
                    console.error(e); fail();
                });
        };
        props.onRemoveQueryElement = (idx) => {
            expect(idx).toBe(1);
            done();
        };
        let wrapper = Fixture(__(SearchBox, props));
    });
    it("should display the suggestion list when something is typed", (done) => {
        const allSearchable = new AllSearchable((s) => Promise.resolve(s));
        let props = SearchboxViaSearchablesProps([allSearchable], []);
        props.onDidUpdate = () => {
            Promise.resolve().then(() => {
                const menuItem = wrapper.find("MenuItem");
                if (menuItem.getNodes().length > 0) { //Wait till it gets loaded
                    const menuItemText = menuItem.text();
                    expect(menuItemText).toBe("All:");
                    done();
                }
            });
        };
        const wrapper = Fixture(__(SearchBox, props));
        wrapper.find("input").at(0).simulate("change", { target: { value: "Al" } });
    });
});
