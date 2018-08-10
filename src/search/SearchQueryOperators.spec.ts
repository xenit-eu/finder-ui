import "core-js";
import "es6-shim";
import { AllSimpleSearchQueryElement, AndSearchQueryElement, NodeRefSearchQueryElement, SearchQuery, StringValuePropertySearchQueryElement, ToFillInSearchQueryElement } from "./searchquery";
import { SearchQueryFactory } from "./SearchQueryFactory";
import { SearchQueryOperator } from "./SearchQueryOperator";
describe("Searchquery operator tests", () => {
    const operator = new SearchQueryOperator();
    const factory = SearchQueryFactory.GetDummySearchQueryFactory();
    it("should be able to build something", () => {
        factory.buildSearchQuery([factory.buildAndQueryElement([])]);
    });
    it("should be able to retrieve the search query element itself", () => {
        const originalType = operator.GetElementFromElementAt([], factory.buildAndQueryElement([])).TYPE;
        expect(originalType).toBe(AndSearchQueryElement.TYPE);
    });
    it("should be able to retrieve a root element from a search query", () => {
        const originalType = operator.GetElementFromQueryAt([0], factory.buildSearchQuery([factory.buildAndQueryElement([])])).TYPE;
        expect(originalType).toBe(AndSearchQueryElement.TYPE);
    });
    it("should be able to retrieve an element from a search query element 3 levels nested", () => {
        const nestedAnd = factory.buildAndQueryElement([factory.buildAndQueryElement([factory.buildAndQueryElement([]), factory.buildNodeQueryElement("testNode")])]);
        expect(operator.GetElementFromElementAt([0], nestedAnd).TYPE).toBe(AndSearchQueryElement.TYPE);
        expect(operator.GetElementFromElementAt([0, 0], nestedAnd).TYPE).toBe(AndSearchQueryElement.TYPE);
        expect(operator.GetElementFromElementAt([0, 1], nestedAnd).TYPE).toBe(NodeRefSearchQueryElement.TYPE);
    });
    it("should be able to retrieve an element from a search query 3 levels nested", () => {
        const nestedAnd = factory.buildSearchQuery([factory.buildAndQueryElement([factory.buildAndQueryElement([factory.buildAndQueryElement([]), factory.buildNodeQueryElement("testNode")])])]);
        expect(operator.GetElementFromQueryAt([0, 0], nestedAnd).TYPE).toBe(AndSearchQueryElement.TYPE);
        expect(operator.GetElementFromQueryAt([0, 0, 0], nestedAnd).TYPE).toBe(AndSearchQueryElement.TYPE);
        expect(operator.GetElementFromQueryAt([0, 0, 1], nestedAnd).TYPE).toBe(NodeRefSearchQueryElement.TYPE);
    });
    it("should be able to append an element to a search query", () => {
        const appended = operator.AppendElement(factory.buildAndQueryElement([]), factory.buildSearchQuery([]));
        expect(appended.elements[0].TYPE).toBe(AndSearchQueryElement.TYPE);
    });
    it("should be able to append an element to a search query which replaces a tofillin", () => {
        const base = factory.buildSearchQuery([factory.buildAndQueryElement([factory.buildAllQueryElement("*"), factory.buildToFillInQueryElement()])]);
        const toAppend = factory.buildNodeQueryElement("noderef");
        const replaced = operator.AppendElement(toAppend, base);
        expect(operator.GetElementFromQueryAt([0, 1], replaced).TYPE).toBe(NodeRefSearchQueryElement.TYPE);
    });
    it("should be able to remove the last element from an and search query", () => {
        const base = factory.buildSearchQuery([factory.buildAndQueryElement([factory.buildAllQueryElement("*"), factory.buildAllQueryElement("*")])]);
        const replaced = operator.RemoveLastQueryElement(base);
        expect(operator.GetElementFromQueryAt([0], replaced).TYPE).toBe(AllSimpleSearchQueryElement.TYPE);
    });
    it("If an hierarchic query element has one element and a fill in, the hierarchichic element should be removed and its first child should remain on remove last", () => {
        const base = factory.buildSearchQuery([factory.buildAndQueryElement([factory.buildAllQueryElement("*"), factory.buildToFillInQueryElement()])]);
        const replaced = operator.RemoveLastQueryElement(base);
        expect(operator.GetElementFromQueryAt([0], replaced).TYPE).toBe(AllSimpleSearchQueryElement.TYPE);
    });
    it("If an hierarchic query element has two elements and a fill in, the fill in should be removed on remove last", () => {
        const base = factory.buildSearchQuery([factory.buildAndQueryElement([factory.buildAllQueryElement("*"), factory.buildAllQueryElement("*"), factory.buildToFillInQueryElement()])]);
        const replaced = operator.RemoveLastQueryElement(base);
        expect(operator.GetElementFromQueryAt([0, 1], replaced).TYPE).toBe(AllSimpleSearchQueryElement.TYPE);
        expect(operator.GetElementFromQueryAt([0, 0], replaced).TYPE).toBe(AllSimpleSearchQueryElement.TYPE);
    });
    it("Should not replace the last root search query element with a fill in, on remove last", () => {
        const withLastRoot = factory.buildSearchQuery([factory.buildStringValuePropertyQueryElement("creator", "system")]);
        const backspaced = operator.RemoveLastQueryElement(withLastRoot);
        expect(backspaced.elements.length).toBe(0);
    });
    it("Should show 1 possible hierarchy to add for a simple all search query element", () => {
        const query = factory.buildSearchQuery([factory.buildAllQueryElement("*")]);
        const combinations = operator.GetAttachableHierarchicElementCombinations(query, "and");
        expect(combinations.length).toBe(1);
    });
    it("Should show 1 possible hierarchy to add for a single and search query element in case of an and operator", () => {
        /*
            There is no need for the following logical duplicates.
            AND(AND(ALL*,ALLB),TOADD) === AND(ALL*,AND(ALLB,TOADD)).
        */
        const query = factory.buildSearchQuery([factory.buildAndQueryElement([factory.buildAllQueryElement("*"), factory.buildAllQueryElement("B")])]);
        const combinations = operator.GetAttachableHierarchicElementCombinations(query, "and");
        expect(combinations.length).toBe(1);
    });
    it("Should show 2 possible hierarchies to add for a single and search query element in case of an or operator", () => {
        const query = factory.buildSearchQuery([factory.buildAndQueryElement([factory.buildAllQueryElement("*"), factory.buildAllQueryElement("B")])]);
        const combinations = operator.GetAttachableHierarchicElementCombinations(query, "or");
        expect(combinations.length).toBe(2);
    });
});
