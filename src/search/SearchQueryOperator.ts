import { allButFirst, last, lastMust, replaceLast, replaceOrRemoveAt } from "./ImmutableListExtensions";
import { AndSearchQueryElement, ISearchQueryElement, isHierarchicSearchQueryElement, OrSearchQueryElement, SearchQuery, ToFillInSearchQueryElement } from "./searchquery";
import { SearchQueryNormalizeVisitor } from "./SearchQueryNormalizeVisitor";
type ComplexSearchQueryElement_t = AndSearchQueryElement | OrSearchQueryElement;
export class SearchQueryOperator {
    private normalizer = new SearchQueryNormalizeVisitor();
    public RemoveElementAt(index: number[], query: SearchQuery) {
        return this.ReplaceElementAt(index, query, null);
    }
    public ReplaceElementAt(index: number[], query: SearchQuery, replaceWith: ISearchQueryElement | null) {
        if (index.length === 0) {
            return query.CreateFromChildren(replaceWith ? [replaceWith.visit(this.normalizer)] : []);
        }
        const removeIndex = index[0];
        const removedOrReplaced = this.ReplaceElementFromElementAt(allButFirst(index), query.elements[removeIndex], replaceWith);
        return query.CreateFromChildren(replaceOrRemoveAt(query.elements, removedOrReplaced, removeIndex));
    }
    private GetComplexQueryElement(element: ISearchQueryElement): ComplexSearchQueryElement_t {
        if (isHierarchicSearchQueryElement(element)) {
            return element;
        }
        throw new Error("Expected hierarchic query.");
    }
    private ReplaceElementFromElementAt(index: number[], queryElement: ISearchQueryElement, replaceWith: ISearchQueryElement | null): ISearchQueryElement | null {
        if (index.length === 0) {
            return replaceWith;
        }
        if (!isHierarchicSearchQueryElement(queryElement)) {
            throw new Error("Cannot remove indexed element from non hierarchic element");
        }
        const currentIndex = index[0];
        const currentChild = queryElement.children[currentIndex];
        if (!currentChild) {
            throw new Error("Hierarchic element does not scontain element at given index: " + currentIndex);
        }
        const newCurrentChild = this.ReplaceElementFromElementAt(allButFirst(index), currentChild, replaceWith);
        const newChildren = replaceOrRemoveAt(queryElement.children, newCurrentChild, currentIndex);
        return queryElement.withChildren(newChildren).visit(this.normalizer);
    }

    public RemoveLastQueryElement(query: SearchQuery) {
        return this.RemoveElementAt(this.GetRemovalIndexFromLast(query), query);
    }
    private GetRemovalIndexFromLast(query: SearchQuery): number[] {
        if (query.elements.length === 0) {
            return [];
        }
        return [query.elements.length - 1].concat(this.GetElementRemovalIndexFromLast(lastMust(query.elements)));
    }
    private GetElementRemovalIndexFromLast(queryElement: ISearchQueryElement): number[] {
        if (!isHierarchicSearchQueryElement(queryElement)) {
            return [];
        }
        if (queryElement.children.length === 0) {
            return [];
        }
        return [queryElement.children.length - 1].concat(this.GetElementRemovalIndexFromLast(lastMust(queryElement.children)));
    }

    public AppendElement(toAdd: ISearchQueryElement, onto: SearchQuery) {
        const lastChild = last(onto.elements);
        const canAddOnExisting = lastChild !== undefined && this.CanAppendElementOnElement(lastChild);
        const newChildren = canAddOnExisting ? replaceLast(onto.elements, this.AppendElementOnElement(toAdd, lastChild as ComplexSearchQueryElement_t)) :
            onto.elements.concat([toAdd]);
        return onto.CreateFromChildren(newChildren);
    }
    private CanAppendElementOnElement(onto: ISearchQueryElement): boolean {
        if (!isHierarchicSearchQueryElement(onto)) {
            return false;
        }
        const lastChild = lastMust(onto.children);
        return lastChild instanceof ToFillInSearchQueryElement || this.CanAppendElementOnElement(lastChild);
    }

    public AppendElementOnElement(toAdd: ISearchQueryElement, onto: ComplexSearchQueryElement_t): ComplexSearchQueryElement_t {
        if (!this.CanAppendElementOnElement(onto)) {
            throw new Error("Cannot append element");
        }
        const latest = lastMust(onto.children);
        const newLatest = (latest instanceof ToFillInSearchQueryElement) ? toAdd : this.AppendElementOnElement(toAdd, this.GetComplexQueryElement(latest));
        return onto.withChildren(replaceLast(onto.children, newLatest));
    }

    public GetElementFromQueryAt(index: number[], searchQuery: SearchQuery) {
        if (index.length === 0) {
            return searchQuery.ToAndQueryElement();
        }
        return this.GetElementFromElementAt(allButFirst(index), searchQuery.elements[index[0]]);
    }

    public GetElementFromElementAt(index: number[], searchQueryElement: ISearchQueryElement): ISearchQueryElement {
        if (index.length === 0) {
            return searchQueryElement;
        }
        return this.GetElementFromElementAt(allButFirst(index), this.GetComplexQueryElement(searchQueryElement).children[index[0]]);
    }

    public GetAttachableHierarchicElementCombinations(searchQuery: SearchQuery, type: "and" | "or") {
        if (searchQuery.elements.length === 0) {
            return [];
        }
        if (searchQuery.elements.length === 1) {
            return this.GetAttachableHierarchicElementCombinationsOnElement(searchQuery.elements[0], [0], type, false);
        }
        return this.GetAttachableHierarchicElementCombinationsOnElement(searchQuery.ToAndQueryElement(), [], type, false); //Has no parent, therefore always false.
    }
    private GetAttachableHierarchicElementCombinationsOnElement(searchQueryElement: ISearchQueryElement, index: number[], type: "and" | "or", parentMatchesType: boolean): number[][] {
        const withSelf = parentMatchesType ? [] : [index];
        if (!searchQueryElement || !isHierarchicSearchQueryElement(searchQueryElement)) {
            return withSelf;
        }
        const selfMatchesType = searchQueryElement.getHierarchicType() === type;
        return withSelf.concat(
            this.GetAttachableHierarchicElementCombinationsOnElement(lastMust(searchQueryElement.children), index.concat([searchQueryElement.children.length - 1]), type, selfMatchesType));
    }
    public buildHierarchyOver(
        searchQueryElement: ISearchQueryElement,
        type: "and" | "or",
        buildHierarchicElement: (children: ISearchQueryElement[]) => ISearchQueryElement,
        buildToFillInElement: () => ToFillInSearchQueryElement) {
        if (isHierarchicSearchQueryElement(searchQueryElement) && searchQueryElement.getHierarchicType() === type) {
            return buildHierarchicElement(searchQueryElement.children.concat([buildToFillInElement()]));
        }
        return buildHierarchicElement([searchQueryElement, buildToFillInElement()]);
    }
    public addHierarchy2(
        searchQuery: SearchQuery,
        index: number[],
        buildHierarchicElement: (children: ISearchQueryElement[]) => ISearchQueryElement,
        buildToFillinElement: () => ToFillInSearchQueryElement,
        type: "and" | "or") {
        const hierarchy = this.buildHierarchyOver(this.GetElementFromQueryAt(index, searchQuery), type, buildHierarchicElement, buildToFillinElement);
        const ret = this.ReplaceElementAt(index, searchQuery, hierarchy);
        return ret;
    }
}
