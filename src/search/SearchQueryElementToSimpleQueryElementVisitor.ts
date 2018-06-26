import {
    AllSimpleSearchQueryElement, AndSearchQueryElement, AspectSearchQueryElement,
    DatePropertySearchQueryElement, FolderSearchQueryElement, ISearchQueryElement, ISearchQueryElementVisitor, ISimpleSearchQueryElement,
    NodeRefSearchQueryElement, OrSearchQueryElement, ReferenceSimpleSearchQueryElement, SearchQuery, StringValuePropertySearchQueryElement,
    TextSearchQueryElement,
    TypeSearchQueryElement,

} from "./searchquery";
import { SearchQueryElementReadableStringVisitor } from "./SearchQueryElementReadableStringVisitor";
import { SUBQUERY } from "./WordTranslator";
export class SearchQueryElementToSimpleQueryElementVisitor implements ISearchQueryElementVisitor<ISimpleSearchQueryElement> {

    private readabler: SearchQueryElementReadableStringVisitor;
    private renameCounter = 0;
    constructor(private translate: (s: string) => string) {
        this.readabler = new SearchQueryElementReadableStringVisitor(translate);
    }

    public generateDummyQuery(complexQuery: AndSearchQueryElement | OrSearchQueryElement): SearchQuery {
        return new SearchQuery([complexQuery], this.translate);
    }
    public visitStringValuePropertySearchQueryElement(query: StringValuePropertySearchQueryElement) {
        return query;
    }
    public visitDatePropertySearchQueryElement(query: DatePropertySearchQueryElement) {
        return query;
    }
    public visitAllSimpleSearchQueryElement(query: AllSimpleSearchQueryElement) {
        return query;
    }
    public visitFolderSearchQueryElement(query: FolderSearchQueryElement) {
        return query;
    }
    public visitTextSearchQueryElement(query: TextSearchQueryElement) {
        return query;
    }
    public visitReferenceSimpleSearchQueryElement(query: ReferenceSimpleSearchQueryElement) {
        return query;
    }
    public visitOrSearchQueryElement(query: OrSearchQueryElement) {
        const count = ++this.renameCounter;
        return new ReferenceSimpleSearchQueryElement(this.generateDummyQuery(query), this.translate(SUBQUERY) + " " + count);
    }
    public visitAndSearchQueryElement(query: AndSearchQueryElement): ISimpleSearchQueryElement {
        const count = ++this.renameCounter;
        return new ReferenceSimpleSearchQueryElement(this.generateDummyQuery(query), this.translate(SUBQUERY) + " " + count);
    }
    public visitAspectSearchQueryElement(query: AspectSearchQueryElement): ISimpleSearchQueryElement {
        return query;
    }
    public visitTypeSearchQueryElement(query: TypeSearchQueryElement): ISimpleSearchQueryElement {
        return query;
    }
    public visitNodeRefSearchQueryElement(query: NodeRefSearchQueryElement): ISimpleSearchQueryElement {
        return query;
    }

}
