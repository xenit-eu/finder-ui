import { ISearchQueryElement } from "./searchquery";
import {
    AllSimpleSearchQueryElement, AndSearchQueryElement, DatePropertySearchQueryElement,
    FolderSearchQueryElement, ISearchQueryElementVisitor,
    OrSearchQueryElement, ReferenceSimpleSearchQueryElement, StringValuePropertySearchQueryElement,
    TextSearchQueryElement,
} from "./searchquery";
import { SearchQueryElementReadableStringVisitor } from "./SearchQueryElementReadableStringVisitor";
import { SUBQUERY } from "./WordTranslator";

export class SearchQueryFilter implements ISearchQueryElementVisitor<void> {
    public matching: ISearchQueryElement[] = [];
    constructor(private filterCondition: (el: ISearchQueryElement) => boolean) {
    }
    public AddIfConditionTrue(queryElement: ISearchQueryElement) {
        if (this.filterCondition(queryElement)) {
            this.matching.push(queryElement);
        }
    }
    public visitStringValuePropertySearchQueryElement(query: StringValuePropertySearchQueryElement) {
        this.AddIfConditionTrue(query);
    }
    public visitDatePropertySearchQueryElement(query: DatePropertySearchQueryElement) {
        this.AddIfConditionTrue(query);
    }
    public visitAllSimpleSearchQueryElement(query: AllSimpleSearchQueryElement) {
        this.AddIfConditionTrue(query);
    }
    public visitFolderSearchQueryElement(query: FolderSearchQueryElement) {
        this.AddIfConditionTrue(query);
    }
    public visitTextSearchQueryElement(query: TextSearchQueryElement) {
        this.AddIfConditionTrue(query);
    }
    public visitReferenceSimpleSearchQueryElement(query: ReferenceSimpleSearchQueryElement) {
        this.AddIfConditionTrue(query);
    }
    public visitOrSearchQueryElement(query: OrSearchQueryElement) {
        this.filterCondition(query);
        query.children.map(c => c.visit(this));
    }
    public visitAndSearchQueryElement(query: AndSearchQueryElement) {
        this.filterCondition(query);
        query.children.map(c => c.visit(this));
    }

}
