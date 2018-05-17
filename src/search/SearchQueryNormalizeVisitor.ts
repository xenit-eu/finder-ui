import { ISearchQueryElement } from "./searchquery";
import { AllSimpleSearchQueryElement, AndSearchQueryElement,
     DatePropertySearchQueryElement, FolderSearchQueryElement, ISearchQueryElementVisitor,
     ISimpleSearchQueryElement, OrSearchQueryElement, ReferenceSimpleSearchQueryElement, StringValuePropertySearchQueryElement,
      TextSearchQueryElement } from "./searchquery";
import { SearchQueryElementReadableStringVisitor } from "./SearchQueryElementReadableStringVisitor";
import { SUBQUERY } from "./WordTranslator";

export class SearchQueryNormalizeVisitor implements ISearchQueryElementVisitor<ISearchQueryElement> {
    public visitStringValuePropertySearchQueryElement(query: StringValuePropertySearchQueryElement): ISearchQueryElement {
        return query;
    }
    public visitDatePropertySearchQueryElement(query: DatePropertySearchQueryElement): ISearchQueryElement {
        return query;
    }
    public visitAllSimpleSearchQueryElement(query: AllSimpleSearchQueryElement): ISearchQueryElement {
        return query;
    }
    public visitFolderSearchQueryElement(query: FolderSearchQueryElement): ISearchQueryElement {
        return query;
    }
    public visitTextSearchQueryElement(query: TextSearchQueryElement): ISearchQueryElement {
        return query;
    }
    public visitReferenceSimpleSearchQueryElement(query: ReferenceSimpleSearchQueryElement): ISearchQueryElement {
        return query;
    }
    public visitOrSearchQueryElement(query: OrSearchQueryElement): ISearchQueryElement {
        if (query.children.length === 1) {
            return query.children[0];
        }
        return new OrSearchQueryElement(query.children.map(c => c.visit(this)));
    }
    public visitAndSearchQueryElement(query: AndSearchQueryElement): ISearchQueryElement {
        if (query.children.length === 1) {
            return query.children[0];
        }
        return new AndSearchQueryElement(query.children.map(c => c.visit(this)));
    }

}
