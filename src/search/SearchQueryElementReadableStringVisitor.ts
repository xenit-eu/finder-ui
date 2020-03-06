import { AND, OR } from "../WordTranslator";
import {
    AllSimpleSearchQueryElement, AndSearchQueryElement, AspectSearchQueryElement,
    DatePropertySearchQueryElement, FolderSearchQueryElement, ISearchQueryElementVisitor,
    NodeRefSearchQueryElement, OrSearchQueryElement, ReferenceSimpleSearchQueryElement, SizeQueryElement,
    StringValuePropertySearchQueryElement,
    TextSearchQueryElement,
    ToFillInSearchQueryElement,
    TypeSearchQueryElement,

} from "./searchquery";
import { SearchQueryNormalizeVisitor } from "./SearchQueryNormalizeVisitor";
export class SearchQueryElementReadableStringVisitor implements ISearchQueryElementVisitor<Promise<string>> {
    public visitSizeQueryElement(query: SizeQueryElement): Promise<string> {
        return query.getSimpleSearchbarText();
    }
    private normalizer = new SearchQueryNormalizeVisitor();
    constructor(private translate: (s: string) => string) {
    }
    public visitStringValuePropertySearchQueryElement(query: StringValuePropertySearchQueryElement) {
        return query.getSimpleSearchbarText();
    }
    public visitDatePropertySearchQueryElement(query: DatePropertySearchQueryElement) {
        return query.getSimpleSearchbarText();
    }
    public visitAllSimpleSearchQueryElement(query: AllSimpleSearchQueryElement) {
        return query.getSimpleSearchbarText();
    }
    public visitFolderSearchQueryElement(query: FolderSearchQueryElement) {
        return query.getSimpleSearchbarText();
    }
    public visitTextSearchQueryElement(query: TextSearchQueryElement) {
        return query.getSimpleSearchbarText();
    }
    public visitReferenceSimpleSearchQueryElement(query: ReferenceSimpleSearchQueryElement): Promise<string> {
        return Promise.resolve(query.name);
    }
    public visitOrSearchQueryElement(query: OrSearchQueryElement): Promise<string> {
        const normalized = query.visit(this.normalizer);
        if (normalized instanceof OrSearchQueryElement) {
            return Promise.all(query.children.map((c) => c.visit(this))).then((childText) => this.translate(OR) + "(" + childText.join(", ") + ")");
        }
        return normalized.visit(this);
    }
    public visitAndSearchQueryElement(query: AndSearchQueryElement): Promise<string> {
        const normalized = query.visit(this.normalizer);
        if (normalized instanceof AndSearchQueryElement) {
            return Promise.all(query.children.map((c) => c.visit(this))).then((childText) => this.translate(AND) + "(" + childText.join(", ") + ")");
        }
        return normalized.visit(this);
    }
    public visitAspectSearchQueryElement(query: AspectSearchQueryElement): Promise<string> {
        return query.getSimpleSearchbarText();

    }
    public visitTypeSearchQueryElement(query: TypeSearchQueryElement): Promise<string> {
        return query.getSimpleSearchbarText();

    }
    public visitNodeRefSearchQueryElement(query: NodeRefSearchQueryElement): Promise<string> {
        return query.getSimpleSearchbarText();
    }
    public visitToFillInSearchQueryElement(query: ToFillInSearchQueryElement): Promise<string> {
        return query.getSimpleSearchbarText();
    }
}
