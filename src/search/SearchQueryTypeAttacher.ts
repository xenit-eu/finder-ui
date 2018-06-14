import {
    AllSimpleSearchQueryElement, AndSearchQueryElement,
    DatePropertySearchQueryElement, FolderSearchQueryElement, ISearchQueryElementVisitor, OrSearchQueryElement,
    ReferenceSimpleSearchQueryElement,
    StringValuePropertySearchQueryElement,
    TextSearchQueryElement,
} from "./searchquery";
export class SearchQueryTypeAttacher implements ISearchQueryElementVisitor<any & { TYPE: string }> {
    /*In case you are adding an element here do not forget to add an element in the parsing process too... otherwise your searchqueryelement will not be reloaded.*/
    public visitDatePropertySearchQueryElement(query: DatePropertySearchQueryElement) {
        return { TYPE: DatePropertySearchQueryElement.TYPE, ...query };
    }
    public visitAllSimpleSearchQueryElement(query: AllSimpleSearchQueryElement) {
        return { TYPE: AllSimpleSearchQueryElement.TYPE, ...query };
    }
    public visitFolderSearchQueryElement(query: FolderSearchQueryElement) {
        return { TYPE: FolderSearchQueryElement.TYPE, ...query };
    }
    public visitTextSearchQueryElement(query: TextSearchQueryElement) {
        return { TYPE: TextSearchQueryElement.TYPE, ...query };
    }
    public visitReferenceSimpleSearchQueryElement(query: ReferenceSimpleSearchQueryElement) {
        return { TYPE: ReferenceSimpleSearchQueryElement.TYPE, ...query };
    }
    public visitOrSearchQueryElement(query: OrSearchQueryElement) {
        query.children = query.children.map(child => child.visit(this));
        return { TYPE: OrSearchQueryElement.TYPE, ...query };
    }

    public visitAndSearchQueryElement(query: AndSearchQueryElement) {
        query.children = query.children.map(child => child.visit(this));
        return { TYPE: AndSearchQueryElement.TYPE, ...query };
    }
    public visitStringValuePropertySearchQueryElement(query: StringValuePropertySearchQueryElement): any & { type: string } {
        return { TYPE: StringValuePropertySearchQueryElement.TYPE, ...query };
    }
}
