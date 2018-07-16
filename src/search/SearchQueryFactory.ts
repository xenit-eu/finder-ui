import { IDateRange, IDateRangeTranslator } from "./DateRange";
import {
    AllSimpleSearchQueryElement, AndSearchQueryElement, AspectSearchQueryElement,
    DatePropertySearchQueryElement, FolderSearchQueryElement, IASynchronousTranslationService,
    IRetrievePathOfFolder, ISearchQueryElement, ISynchronousTranslationService,
    NodeRefSearchQueryElement, OrSearchQueryElement, PropertyNameService_t,
    ReferenceSimpleSearchQueryElement, SearchQuery,
    StringValuePropertySearchQueryElement, TextSearchQueryElement, TypeSearchQueryElement,
} from "./searchquery";

export interface IFolderSearchQueryElementFactory {
    buildFolderQueryElement(noderef: string): FolderSearchQueryElement;
}
export class SearchQueryFactory implements IFolderSearchQueryElementFactory {
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
        return new AndSearchQueryElement(children);
    }
    public buildOrQueryElement(children: ISearchQueryElement[]) {
        return new OrSearchQueryElement(children);
    }
}
