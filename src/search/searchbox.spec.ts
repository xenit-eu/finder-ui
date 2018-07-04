import "core-js";
import { configure } from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import "es6-shim";
import { createElement as __ } from "react";
import { Fixture } from "./../testUtils";
import { AllSearchable, ISimpleSearchableQueryElement, SimpleAutoCompleteListElement, TextSearchable } from "./searchables";
import { SearchBox, SearchBox_t } from "./searchbox";
import { ISimpleSearchQueryElement, StringValuePropertySearchQueryElement } from "./searchquery";
// tslint:disable-next-line:no-var-requires
const jasmineEnzyme = require("jasmine-enzyme"); // no typings for jasmine-engine => require instead of import.

configure({ adapter: new Adapter() });

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

    beforeEach(() => {
        jasmineEnzyme();
    });

    function SearchboxViaSearchablesProps(searchables: ISimpleSearchableQueryElement[], queryElements: ISimpleSearchQueryElement[], autocompleteSuggestions: SimpleAutoCompleteListElement[] = []) {
        const retProps: SearchBox_t = {
            autocompleteSuggestions,
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
        let props = SearchboxViaSearchablesProps([new TextSearchable("name", (s) => s)], []);
        props.onAddQueryElement = (idx) => {
            done();
        };
        const wrapper = Fixture(__(SearchBox, props));
        const text = "text:name";
        //        const input: any = wrapper.find("input").get(0);

        wrapper.find("input").simulate("change", { target: { value: text } });
        wrapper.find("input").simulate("keyUp", { keyCode: ENTER_KEY_CODE });
    });

    it("should make a chip of a query with only value when there is an allsearchable ", (done) => {
        let props = SearchboxViaSearchablesProps([new AllSearchable((s) => s)], []);
        props.onAddQueryElement = (idx) => {
            done();
        };
        const wrapper = Fixture(__(SearchBox, props));
        const text = "name";

        wrapper.find("input").simulate("change", { target: { value: text } });
        wrapper.find("input").simulate("keyUp", { keyCode: ENTER_KEY_CODE });
    });

    it("should display provided list of terms in chips components", (done) => {
        const qE: StringValuePropertySearchQueryElement[] =
            [new StringValuePropertySearchQueryElement("dummy1", "dummy2", dummyPropertyService()), new StringValuePropertySearchQueryElement("dummy3", "dummy4", dummyPropertyService())];
        let props = SearchboxViaSearchablesProps([new AllSearchable((s) => s)], qE);
        props.onChipsUpdated = () => {
            wrapper.update();
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
        let props = SearchboxViaSearchablesProps([new AllSearchable((s) => s)], qE);
        props.onChipsUpdated = () => {
            wrapper.update();
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

    it("Should call onRemoveTerm with the index of the latest item when pressing backspace in an empty input field", (done) => {
        const qE: StringValuePropertySearchQueryElement[] =
            [new StringValuePropertySearchQueryElement("dummy1", "dummy2", dummyPropertyService()), new StringValuePropertySearchQueryElement("dummy3", "dummy4", dummyPropertyService())];
        let props = SearchboxViaSearchablesProps([new AllSearchable((s) => s)], qE);
        props.onChipsUpdated = () => {
            wrapper.update();
            wrapper.find("input").at(0).simulate("keydown", { keyCode: 8 });
        };
        props.onRemoveQueryElement = (idx) => {
            expect(idx).toBe(1);
            done();
        };
        let wrapper = Fixture(__(SearchBox, props));
    });

    it("should display the suggestion list when something is typed", (done) => {
        const allSearchable = new AllSearchable((s) => s);
        let props = SearchboxViaSearchablesProps([allSearchable], [], [new SimpleAutoCompleteListElement("All", "good", "All:good")]);
        props.onDidUpdate = () => {
            Promise.resolve().then(() => {
                const menuItem = wrapper.find("MenuItem");
                if (menuItem.getElements().length > 0) { //Wait till it gets loaded
                    const menuItemText = menuItem.text();
                    expect(menuItemText).toBe("All:good");
                    done();
                }
            });
        };
        const wrapper = Fixture(__(SearchBox, props));
        wrapper.find("input").at(0).simulate("change", { target: { value: "ood" } });
    });
});
