import {
    AllSimpleSearchQueryElement, AndSearchQueryElement,
    DatePropertySearchQueryElement, FolderSearchQueryElement, ISearchQueryElementVisitor, OrSearchQueryElement,
    ReferenceSimpleSearchQueryElement,
    StringValuePropertySearchQueryElement,
    TextSearchQueryElement,
} from "./searchquery";
export class SearchQueryTypeAttacher implements ISearchQueryElementVisitor<any & { type: string }> {
    /*In case you are adding an element here do not forget to add an element in the parsing process too... otherwise your searchqueryelement will not be reloaded.*/
    public visitDatePropertySearchQueryElement(query: DatePropertySearchQueryElement) {
        return { type: DatePropertySearchQueryElement.TYPE, ...query };
    }
    public visitAllSimpleSearchQueryElement(query: AllSimpleSearchQueryElement) {
        return { type: AllSimpleSearchQueryElement.TYPE, ...query };
    }
    public visitFolderSearchQueryElement(query: FolderSearchQueryElement) {
        return { type: FolderSearchQueryElement.TYPE, ...query };
    }
    public visitTextSearchQueryElement(query: TextSearchQueryElement) {
        return { type: TextSearchQueryElement.TYPE, ...query };
    }
    public visitReferenceSimpleSearchQueryElement(query: ReferenceSimpleSearchQueryElement) {
        return { type: ReferenceSimpleSearchQueryElement.TYPE, ...query };
    }
    public visitOrSearchQueryElement(query: OrSearchQueryElement) {
        query.children = query.children.map(child => child.visit(this));
        return { type: OrSearchQueryElement.TYPE, ...query };
    }

    public visitAndSearchQueryElement(query: AndSearchQueryElement) {
        query.children = query.children.map(child => child.visit(this));
        return { type: AndSearchQueryElement.TYPE, ...query };
    }
    public visitStringValuePropertySearchQueryElement(query: StringValuePropertySearchQueryElement): any & { type: string } {
        return { type: StringValuePropertySearchQueryElement.TYPE, ...query };
    }
}
