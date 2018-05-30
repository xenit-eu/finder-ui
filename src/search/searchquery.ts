import * as debug from "debug";
const d = debug("finder-ui:finderquery");
import { IDateRange, IDateRangeTranslator } from "./DateRange";
import { ISearchQuery } from "./searchquery";

// This is a fake type. The document type is mapped to this QName to be able to put all document information in a hashmap.
export const TYPE_QNAME = "{http://www.alfresco.org/model/content/1.0}type";

export interface ISearchQuery {
    HumanReadableText(): Promise<string>;
    GetRootSearchQueryElement(): ISearchQueryElement;
}
export class SimpleSearchQuery implements ISearchQuery {
    constructor(public elements: ISimpleSearchQueryElement[]) {
    }
    public HumanReadableText() {
        return Promise.all(this.elements.map(e => e.getSimpleSearchbarText())).then(texts => texts.join());
    }
    public GetRootSearchQueryElement(): ISearchQueryElement {
        return new OrSearchQueryElement(this.elements);
    }
}
export type TranslationService_t = (s: string) => Promise<string>;

export type PropertyKeyNameService_t = {
    translatePropertyKey: (key: string) => Promise<string>,
};

export type PropertyValueNameService_t = {
    translatePropertyValue: (key: string, value: string) => Promise<string>;
};

export type PropertyNameService_t = PropertyKeyNameService_t & PropertyValueNameService_t;
export class AdvancedSearchQuery implements ISearchQuery {
    public HumanReadableText() {
        return Promise.resolve("Advanced search query");
    }
    public GetRootSearchQueryElement(): ISearchQueryElement {
        throw "NotImplemented";
    }
}
export interface ISearchQueryElement {
    visit<T>(visitor: ISearchQueryVisitor<T>): T;
}
export interface ISimpleSearchQueryElement extends ISearchQueryElement {
    getSimpleSearchbarText(): Promise<string>;
    getTooltipText(): Promise<string>;
    isReferential?: boolean;
}

export class ReferenceSimpleSearchQueryElement implements ISimpleSearchQueryElement {
    public getSimpleSearchbarText() {
        return Promise.resolve(this.name);
    }
    public getTooltipText() {
        return Promise.resolve(this.name);
    }
    public constructor(public wrappedQuery: ISearchQuery, public name: string) {
    }
    public get isReferential() { return true; }
    public visit<T>(visitor: ISearchQueryVisitor<T>): T {
        return visitor.visitReferenceSimpleSearchQueryElement(this);
    }
}

export class TextSearchQueryElement implements ISimpleSearchQueryElement {
    public constructor(public text: string, private translationService: TranslationService_t) {
    }

    public getSimpleSearchbarText() {
        return this.translationService("Text").then(key => key + ":" + this.text);
    }
    public getTooltipText() {
        return Promise.resolve(this.text);
    }
    public visit<T>(visitor: ISearchQueryVisitor<T>): T {
        return visitor.visitTextSearchQueryElement(this);
    }

}

export class FolderSearchQueryElement implements ISimpleSearchQueryElement {
    constructor(public qnamePath: string, public displayPath: string, private translationService: TranslationService_t) {
        //displayPath == Equals (the alfresco displayPath + "/"  + name), but no '/' in the begin, so for example: "Company Home/Data Dictionary"
    }
    public getSimpleSearchbarText() {
        return this.translationService("Folder").then(f => f + ":" + this.displayPath);
    }
    public getTooltipText() {
        return Promise.resolve(this.displayPath);
    }
    public visit<T>(visitor: ISearchQueryVisitor<T>): T {
        return visitor.visitFolderSearchQueryElement(this);
    }
}

export class AllSimpleSearchQueryElement implements ISimpleSearchQueryElement {
    constructor(private translationService: TranslationService_t, public value: string) {
    }
    public getSimpleSearchbarText() {
        return this.translationService("All").then(f => f + ":" + this.value);
    }
    public getTooltipText() {
        return this.getSimpleSearchbarText();
    }
    public visit<T>(visitor: ISearchQueryVisitor<T>): T {
        return visitor.visitAllSimpleSearchQueryElement(this);
    }
}
export abstract class PropertySearchQueryElement implements ISimpleSearchQueryElement {
    constructor(public key: string, private propertyNameService: PropertyKeyNameService_t) {
    }
    protected abstract GetValueSimpleSearchbarText(): Promise<string>;
    public getSimpleSearchbarText() {
        return Promise.all(
            [
                this.propertyNameService.translatePropertyKey(this.key),
                this.GetValueSimpleSearchbarText(),
            ])
            .then(kv => kv[0] + ":" + kv[1]);
    }
    public abstract visit<T>(visitor: ISearchQueryVisitor<T>): T;

    public getTooltipText() {
        return this.getSimpleSearchbarText();
    }

}
export class DatePropertySearchQueryElement extends PropertySearchQueryElement {
    constructor(qname: string, public dateRange: IDateRange, public DateRangeTranslator: IDateRangeTranslator, propertyNameService: PropertyKeyNameService_t) {
        super(qname, propertyNameService);
    }
    protected GetValueSimpleSearchbarText() {
        return Promise.resolve(this.dateRange.ToHumanReadableString(this.DateRangeTranslator));
    }
    public visit<T>(visitor: ISearchQueryVisitor<T>): T {
        return visitor.visitDatePropertySearchQueryElement(this);
    }
}
export class AndSearchQueryElement implements ISearchQueryElement {
    constructor(public children: ISearchQueryElement[]) {
    }
    public visit<T>(visitor: ISearchQueryVisitor<T>): T {
        return visitor.visitAndSearchQueryElement(this);
    }
}
export class OrSearchQueryElement implements ISearchQueryElement {
    constructor(public children: ISearchQueryElement[]) {
    }
    public visit<T>(visitor: ISearchQueryVisitor<T>): T {
        return visitor.visitOrSearchQueryElement(this);
    }
}

export class EnumPropertySearchQueryElement extends PropertySearchQueryElement {
    constructor(public prop: string, public value: string, private pNameService: PropertyNameService_t, public exact = false) {
        super(prop, pNameService);
    }
    protected GetValueSimpleSearchbarText() {
        return this.pNameService.translatePropertyValue(this.prop, this.value);
    }
    public visit<T>(visitor: ISearchQueryVisitor<T>): T {
        return visitor.visitEnumPropertySearchQueryElement(this);
    }

}
export interface ISearchQueryVisitor<T> {
    visitEnumPropertySearchQueryElement(query: EnumPropertySearchQueryElement): T;
    visitDatePropertySearchQueryElement(query: DatePropertySearchQueryElement): T;
    visitAllSimpleSearchQueryElement(query: AllSimpleSearchQueryElement): T;
    visitFolderSearchQueryElement(query: FolderSearchQueryElement): T;
    visitTextSearchQueryElement(query: TextSearchQueryElement): T;
    visitReferenceSimpleSearchQueryElement(query: ReferenceSimpleSearchQueryElement): T;
    visitOrSearchQueryElement(query: OrSearchQueryElement): T;
    visitAndSearchQueryElement(query: AndSearchQueryElement): T;
}
