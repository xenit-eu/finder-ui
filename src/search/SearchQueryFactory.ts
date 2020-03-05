import { DocumentSizeRange_t } from "./../documentSize";
import { IDateRange, IDateRangeTranslator } from "./DateRange";
import {
    AllSimpleSearchQueryElement, AndSearchQueryElement, AspectSearchQueryElement,
    DatePropertySearchQueryElement, FolderSearchQueryElement, IASynchronousTranslationService,
    IRetrievePathOfFolder, ISearchQueryElement, ISynchronousTranslationService,
    NodeRefSearchQueryElement, OrSearchQueryElement, PropertyNameService_t,
    ReferenceSimpleSearchQueryElement, SearchQuery,
    SizeQueryElement, StringValuePropertySearchQueryElement, TextSearchQueryElement, ToFillInSearchQueryElement, TypeSearchQueryElement,
} from "./searchquery";

export interface IFolderSearchQueryElementFactory {
    buildFolderQueryElement(noderef: string): FolderSearchQueryElement;
}
export class SearchQueryFactory implements IFolderSearchQueryElementFactory {
    public static GetDummySearchQueryFactory(): SearchQueryFactory {
        return new SearchQueryFactory(
            { translateWord: (s) => s, translateDate: (d: Date) => d.toDateString() },
            {
                translatePropertyKey: (key: string) => Promise.resolve(key),
                translatePropertyValue: (key: string, value: string) => Promise.resolve(value),
            },
            (s: string) => s,
            (s: string) => Promise.resolve(s),
            (s: string) => Promise.resolve(s),
            (noderef: string) => Promise.resolve({ qnamePath: noderef, displayPath: noderef }),
        );
    }
    public constructor(
        private dateRangeTranslator: IDateRangeTranslator,
        private propertyNameService: PropertyNameService_t,
        private wordTranslator: ISynchronousTranslationService,
        private aspectNameTranslator: IASynchronousTranslationService,
        private typeNameTranslator: IASynchronousTranslationService,
        private folderPathRetrieval: IRetrievePathOfFolder,
    ) {

    }
    public buildSearchQuery(elements: ISearchQueryElement[]) {
        return new SearchQuery(elements, this.wordTranslator);
    }
    public buildDatePropertyQueryElement(qname: string, dateRange: IDateRange): DatePropertySearchQueryElement {
        return new DatePropertySearchQueryElement(qname, dateRange, this.dateRangeTranslator, this.propertyNameService);
    }
    public buildStringValuePropertyQueryElement(qname: string, value: string) {
        return new StringValuePropertySearchQueryElement(qname, value, this.propertyNameService);
    }
    public buildAllQueryElement(value: string, isUnRemovable?: boolean) {
        return new AllSimpleSearchQueryElement(this.wordTranslator, value, isUnRemovable);
    }
    public buildTextQueryElement(text: string) {
        return new TextSearchQueryElement(text, this.wordTranslator);
    }
    public buildFolderQueryElement(noderef: string) {
        return new FolderSearchQueryElement(noderef, this.folderPathRetrieval, this.wordTranslator);
    }
    public buildAspectQueryElement(aspect: string) {
        return new AspectSearchQueryElement(aspect, this.wordTranslator, this.aspectNameTranslator);
    }
    public buildNodeQueryElement(noderef: string) {
        return new NodeRefSearchQueryElement(noderef, this.wordTranslator);
    }
    public buildTypeQueryElement(pType: string) {
        return new TypeSearchQueryElement(pType, this.wordTranslator, this.typeNameTranslator);
    }
    public buildReferenceQueryElement(wrappedQuery: SearchQuery, name: string) {
        return new ReferenceSimpleSearchQueryElement(wrappedQuery, name);
    }
    public buildAndQueryElement(children: ISearchQueryElement[]) {
        return new AndSearchQueryElement(children, this.wordTranslator);
    }
    public buildOrQueryElement(children: ISearchQueryElement[]) {
        return new OrSearchQueryElement(children, this.wordTranslator);
    }
    public buildToFillInQueryElement() {
        return new ToFillInSearchQueryElement();
    }

    public buildSizeQueryElement(range: DocumentSizeRange_t) {
        return new SizeQueryElement(range,this.wordTranslator);
    }}
