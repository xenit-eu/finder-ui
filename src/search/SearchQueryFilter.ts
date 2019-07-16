import {
    AllSimpleSearchQueryElement, AndSearchQueryElement, AspectSearchQueryElement, DatePropertySearchQueryElement,
    FolderSearchQueryElement, ISearchQueryElement, ISearchQueryElementVisitor,
    NodeRefSearchQueryElement, OrSearchQueryElement, ReferenceSimpleSearchQueryElement, StringValuePropertySearchQueryElement,
    TextSearchQueryElement,
    ToFillInSearchQueryElement,
    TypeSearchQueryElement,
    SizeQueryElement,
} from "./searchquery";
function flatten<T>(arr: T[][]) {
    return ([] as T[]).concat(...arr);
}
export class SearchQueryFilter implements ISearchQueryElementVisitor<ISearchQueryElement[]> {
    visitSizeQueryElement(queryElement: SizeQueryElement): ISearchQueryElement[] {
        return this.includeIfConditionTrue(queryElement);
    }
    public matching: ISearchQueryElement[] = [];
    constructor(private filterCondition: (el: ISearchQueryElement) => boolean) {
    }
    public includeIfConditionTrue(queryElement: ISearchQueryElement) {
        return this.filterCondition(queryElement) ? [queryElement] : [];
    }
    public visitStringValuePropertySearchQueryElement(query: StringValuePropertySearchQueryElement) {
        return this.includeIfConditionTrue(query);
    }
    public visitDatePropertySearchQueryElement(query: DatePropertySearchQueryElement) {
        return this.includeIfConditionTrue(query);
    }
    public visitAllSimpleSearchQueryElement(query: AllSimpleSearchQueryElement) {
        return this.includeIfConditionTrue(query);
    }
    public visitFolderSearchQueryElement(query: FolderSearchQueryElement) {
        return this.includeIfConditionTrue(query);
    }
    public visitTextSearchQueryElement(query: TextSearchQueryElement) {
        return this.includeIfConditionTrue(query);
    }
    public visitReferenceSimpleSearchQueryElement(query: ReferenceSimpleSearchQueryElement) {
        return this.includeIfConditionTrue(query);
    }
    public visitOrSearchQueryElement(query: OrSearchQueryElement): ISearchQueryElement[] {
        const base = this.includeIfConditionTrue(query);
        return base.concat(flatten(query.children.map(c => c.visit(this))));
    }
    public visitAndSearchQueryElement(query: AndSearchQueryElement): ISearchQueryElement[] {
        const base = this.includeIfConditionTrue(query);
        return base.concat(flatten(query.children.map(c => c.visit(this))));
    }
    public visitAspectSearchQueryElement(query: AspectSearchQueryElement) {
        return this.includeIfConditionTrue(query);
    }
    public visitTypeSearchQueryElement(query: TypeSearchQueryElement) {
        return this.includeIfConditionTrue(query);
    }
    public visitNodeRefSearchQueryElement(query: NodeRefSearchQueryElement) {
        return this.includeIfConditionTrue(query);
    }
    public visitToFillInSearchQueryElement(query: ToFillInSearchQueryElement) {
        return this.includeIfConditionTrue(query);
    }
}
