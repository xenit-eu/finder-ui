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
import { EnumPropertySearchQueryElement, ISimpleSearchQueryElement } from "./searchquery";
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

    function SearchboxViaSearchablesProps(searchables: ISimpleSearchableQueryElement[]) {
        const retProps: SearchBox_t = {
            searching: false,
            getQueryElements: () => [],
            searchableQueryElements: searchables,
            onRemoveQueryElement: (idx) => { },
            onAddQueryElement: (idx) => { },
            registerQueryElementsListener: (_) => { },
            onSearch: () => { },
            onInputChanged: () => { },
            onSaveAsQuery: () => { },
            updateChipsOnConstruction: true,
        };
        return retProps;
    }
    it("should call onSearch callback when enter key pressed without input text", (done) => {
        const props = SearchboxViaSearchablesProps([]);
        spyOn(props, "onSearch");
        const wrapper = Fixture(__(SearchBox, props));
        wrapper.find("input").simulate("keyUp", { keyCode: ENTER_KEY_CODE });
        expect(props.onSearch).toHaveBeenCalled();
        done();

    });

    it("should call onAddQueryElement with entered text when enter key pressed after entering text in input field", (done) => {
        const inlineExpect = expect;
        let queryElements: ISimpleSearchQueryElement[] = [];
        let props = SearchboxViaSearchablesProps([new TextSearchable("name", (s) => Promise.resolve(s))]);
        props.onAddQueryElement = (idx) => {
            queryElements.push(idx);
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
        let queryElements: ISimpleSearchQueryElement[] = [];
        let props = SearchboxViaSearchablesProps([new AllSearchable((s) => Promise.resolve(s))]);
        props.onAddQueryElement = (idx) => {
            queryElements.push(idx);
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
        let props = SearchboxViaSearchablesProps([new AllSearchable((s) => Promise.resolve(s))]);
        const qE: EnumPropertySearchQueryElement[] =
            [new EnumPropertySearchQueryElement("dummy1", "dummy2", dummyPropertyService()), new EnumPropertySearchQueryElement("dummy3", "dummy4", dummyPropertyService())];
        props.getQueryElements = () => {
            return qE;
        };
        props.onChipsUpdated = () => {
            expect(wrapper.find("Chip").length).toBe(qE.length);
            Promise.all(qE.map((q, i) => q.getSimpleSearchbarText()
                .then(ssT => expect(wrapper.find("Chip").at(i).text()).toBe(ssT))))
                .then(theTestIs => done())
                .catch((e) => { expect("You shall not").toBe(" pass"); console.error(e); done(); });
        };
        const wrapper = Fixture(__(SearchBox, props));
    });

    it("should call onRemoveTerm with index of removed item when deleting a specific term", (done) => {
        let props = SearchboxViaSearchablesProps([new AllSearchable((s) => Promise.resolve(s))]);
        const qE: EnumPropertySearchQueryElement[] =
            [new EnumPropertySearchQueryElement("dummy1", "dummy2", dummyPropertyService()), new EnumPropertySearchQueryElement("dummy3", "dummy4", dummyPropertyService())];
        props.getQueryElements = () => { return qE; };
        props.onChipsUpdated = () => {
            expect(wrapper.find("Chip").length).toBe(qE.length);
            Promise.all(qE.map((q, i) => q.getSimpleSearchbarText()
                .then(ssT => expect(wrapper.find("Chip").at(i).text()).toBe(ssT))))
                .catch((e) => { expect("You shall not").toBe(" pass"); console.error(e); done(); })
                .then(() => {
                    const onrequestDelete = <any>wrapper.find("Chip").at(1).prop("onRequestDelete");
                    onrequestDelete();
                }).catch(e => {
                    expect("You shall not").toBe(" pass"); console.error(e); done();
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
        let props = SearchboxViaSearchablesProps([allSearchable]);
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
