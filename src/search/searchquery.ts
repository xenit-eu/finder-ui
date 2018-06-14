import * as debug from "debug";
import { DateSearchable } from "./searchables";
import { ALL, TEXT } from "./WordTranslator";
const d = debug("finder-ui:finderquery");
import { IDateRange, IDateRangeTranslator } from "./DateRange";
import { SearchQueryElementReadableStringVisitor } from "./SearchQueryElementReadableStringVisitor";

// This is a fake type. The document type is mapped to this QName to be able to put all document information in a hashmap.
export const TYPE_QNAME = "{http://www.alfresco.org/model/content/1.0}type";
export interface ISynchronousTranslationService {
    (s: string): string;
}
export class SearchQuery {
    private readabler: SearchQueryElementReadableStringVisitor;
    public constructor(public elements: ISearchQueryElement[], translate: ISynchronousTranslationService) {
        this.readabler = new SearchQueryElementReadableStringVisitor(translate);
    }
    public ToJSON(searchQueryElementToJSON: (e: ISearchQueryElement) => any): any {
        return { elements: this.elements.map(searchQueryElementToJSON) };
    }
    public ParseJSON(json: any, jsonToSearchQueryElement: (json: any) => ISearchQueryElement, translateWord: ISynchronousTranslationService): SearchQuery {
        return new SearchQuery(json.elements.map(jsonToSearchQueryElement), translateWord);
    }
    public HumanReadableText() {
        return this.GetRootSearchQueryElement().visit(this.readabler);
    }
    public GetRootSearchQueryElement() {
        return this.elements.length === 1 ? this.elements[0] : new AndSearchQueryElement(this.elements);
    }
}

export interface IASynchronousTranslationService { (s: string): Promise<string>; };
export interface IPropertyKeyNameService {
    translatePropertyKey(key: string): Promise<string>;
}

export interface IPropertyValueNameService {
    translatePropertyValue(key: string, value: string): Promise<string>;
}

export type PropertyNameService_t = IPropertyKeyNameService & IPropertyValueNameService;

export interface ISearchQueryElement {
    visit<T>(visitor: ISearchQueryElementVisitor<T>): T;
    conflictsWith(other: ISearchQueryElement): boolean;
}
export interface ISimpleSearchQueryElement extends ISearchQueryElement {
    getSimpleSearchbarText(): Promise<string>;
    getTooltipText(): Promise<string>;
    isReferential(): boolean;
    isRemovable(): boolean;
}

export class ReferenceSimpleSearchQueryElement implements ISimpleSearchQueryElement {
    public static readonly TYPE = "ReferenceSimpleSearchQueryElement";
    public static ParseFromJSON(json: any, context: ISearchQueryElementFromJSONContext) {
        const typecheckSafety: ReferenceSimpleSearchQueryElement = json;
        return new ReferenceSimpleSearchQueryElement(context.SearchQueryFromJSON(typecheckSafety.wrappedQuery), typecheckSafety.name);
    };
    public getSimpleSearchbarText() {
        return Promise.resolve(this.name);
    }
    public getTooltipText() {
        return Promise.resolve(this.name);
    }
    public constructor(public wrappedQuery: SearchQuery, public name: string) {
    }
    public isReferential() { return true; }
    public isRemovable() { return true; }

    public visit<T>(visitor: ISearchQueryElementVisitor<T>): T {
        return visitor.visitReferenceSimpleSearchQueryElement(this);
    }
    public conflictsWith(other: ISearchQueryElement) {
        return this.wrappedQuery.GetRootSearchQueryElement().conflictsWith(other);
    }
}

export class TextSearchQueryElement implements ISimpleSearchQueryElement {
    public static readonly TYPE = "TextSearchQueryElement";
    public static ParseFromJSON(json: any, context: ISearchQueryElementFromJSONContext) {
        const typecheckSafety: TextSearchQueryElement = json;
        return new TextSearchQueryElement(typecheckSafety.text, context.GetWordTranslator());
    };
    public constructor(public text: string, private translationService: ISynchronousTranslationService) {
    }
    public isReferential() { return false; }
    public isRemovable() { return true; }

    public getSimpleSearchbarText() {
        return Promise.resolve(this.translationService(TEXT) + ":" + this.text);
    }
    public getTooltipText() {
        return Promise.resolve(this.text);
    }
    public visit<T>(visitor: ISearchQueryElementVisitor<T>): T {
        return visitor.visitTextSearchQueryElement(this);
    }
    public conflictsWith(other: ISearchQueryElement) {
        return false;
    }

}

export class FolderSearchQueryElement implements ISimpleSearchQueryElement {
    public static readonly TYPE = "FolderSearchQueryElement";
    public static ParseFromJSON(json: any, context: ISearchQueryElementFromJSONContext) {
        const typecheckSafety: FolderSearchQueryElement = json;
        return new FolderSearchQueryElement(typecheckSafety.qnamePath, typecheckSafety.displayPath, context.GetWordTranslator(), typecheckSafety.noderef);
    };
    public isReferential() { return false; }
    public isRemovable() { return true; }

    constructor(public qnamePath: string, public displayPath: string, private translationService: ISynchronousTranslationService, public noderef: string) {
        //displayPath here means (the alfresco displayPath + "/"  + name), but no '/' in the begin, so for example: "Company Home/Data Dictionary"
    }
    public getSimpleSearchbarText() {
        return Promise.resolve(this.translationService("Folder") + ":" + this.displayPath);
    }
    public getTooltipText() {
        return Promise.resolve(this.displayPath);
    }
    public visit<T>(visitor: ISearchQueryElementVisitor<T>): T {
        return visitor.visitFolderSearchQueryElement(this);
    }
    public conflictsWith(other: ISearchQueryElement) {
        return other instanceof FolderSearchQueryElement;
    }
}

export class AllSimpleSearchQueryElement implements ISimpleSearchQueryElement {
    public static readonly TYPE = "AllSimpleSearchQueryElement";
    public static ParseFromJSON(json: any, context: ISearchQueryElementFromJSONContext) {
        const typecheckSafety: AllSimpleSearchQueryElement = json;
        return new AllSimpleSearchQueryElement(context.GetWordTranslator(), typecheckSafety.value, typecheckSafety.isUnremovable);
    };

    constructor(private AllWordtranslationService: ISynchronousTranslationService, public value: string, public isUnremovable = false) {
    }
    public isReferential() { return false; }
    public isRemovable() { return !this.isUnremovable; }
    public getSimpleSearchbarText() {
        return Promise.resolve(this.AllWordtranslationService(ALL) + ":" + this.value);
    }
    public getTooltipText() {
        return this.getSimpleSearchbarText();
    }
    public visit<T>(visitor: ISearchQueryElementVisitor<T>): T {
        return visitor.visitAllSimpleSearchQueryElement(this);
    }
    public conflictsWith(other: ISearchQueryElement) {
        return false;
    }
}
export abstract class PropertySearchQueryElement implements ISimpleSearchQueryElement {
    constructor(public key: string, private propertyNameService: IPropertyKeyNameService) {
        if (!key || key.length === 0) {
            throw new Error("Key should be a valid property key");
        }
    }
    protected abstract GetValueSimpleSearchbarText(): Promise<string>;
    public isReferential() { return false; }
    public isRemovable() { return true; }
    public getSimpleSearchbarText() {
        return Promise.all(
            [
                this.propertyNameService.translatePropertyKey(this.key),
                this.GetValueSimpleSearchbarText(),
            ])
            .then(kv => kv[0] + ":" + kv[1]);
    }
    public abstract visit<T>(visitor: ISearchQueryElementVisitor<T>): T;

    public getTooltipText() {
        return this.getSimpleSearchbarText();
    }
    public conflictsWith(other: ISearchQueryElement): boolean {
        return ((other instanceof PropertySearchQueryElement) && other.key === this.key);
    }

}
export class DatePropertySearchQueryElement extends PropertySearchQueryElement {
    public static readonly TYPE = "DatePropertySearchQueryElement";
    public static ParseFromJSON(json: any, context: ISearchQueryElementFromJSONContext) {
        const typecheckSafety: DatePropertySearchQueryElement = json;
        return new DatePropertySearchQueryElement(typecheckSafety.key, context.DateRangeFromJSON(json.dateRange), context.GetDateRangeTranslator(), context.GetPropertyNameService());
    };
    constructor(qname: string, public dateRange: IDateRange, public DateRangeTranslator: IDateRangeTranslator, propertyNameService: IPropertyKeyNameService) {
        super(qname, propertyNameService);
    }
    protected GetValueSimpleSearchbarText() {
        return Promise.resolve(this.dateRange.ToHumanReadableString(this.DateRangeTranslator));
    }
    public visit<T>(visitor: ISearchQueryElementVisitor<T>): T {
        return visitor.visitDatePropertySearchQueryElement(this);
    }
}
export class AndSearchQueryElement implements ISearchQueryElement {
    public static readonly TYPE = "AndSearchQueryElement";
    public static ParseFromJSON(json: any, context: ISearchQueryElementFromJSONContext) {
        const typecheckSafety: AndSearchQueryElement = json;
        return new AndSearchQueryElement(typecheckSafety.children.map(e => context.SearchQueryElementFromJSON(e)));
    };
    constructor(public children: ISearchQueryElement[]) {
    }
    public visit<T>(visitor: ISearchQueryElementVisitor<T>): T {
        return visitor.visitAndSearchQueryElement(this);
    }
    public conflictsWith(other: ISearchQueryElement) {
        return false;
    }
}
export class OrSearchQueryElement implements ISearchQueryElement {
    public static readonly TYPE = "OrSearchQueryElement";
    public static ParseFromJSON(json: any, context: ISearchQueryElementFromJSONContext) {
        const typecheckSafety: OrSearchQueryElement = json;
        return new OrSearchQueryElement(typecheckSafety.children);
    };
    constructor(public children: ISearchQueryElement[]) {
    }
    public visit<T>(visitor: ISearchQueryElementVisitor<T>): T {
        return visitor.visitOrSearchQueryElement(this);
    }
    public conflictsWith(other: ISearchQueryElement) {
        return false;
    }

}

export class StringValuePropertySearchQueryElement extends PropertySearchQueryElement {
    public static readonly TYPE: "StringValuePropertySearchQueryElement";
    public static ParseFromJSON(json: any, context: ISearchQueryElementFromJSONContext) {
        const typecheckSafety: StringValuePropertySearchQueryElement = json;
        return new StringValuePropertySearchQueryElement(typecheckSafety.prop, typecheckSafety.value, context.GetPropertyNameService());
    };
    constructor(public prop: string, public value: string, private pNameService: PropertyNameService_t) {
        super(prop, pNameService);
    }
    protected GetValueSimpleSearchbarText() {
        return this.pNameService.translatePropertyValue(this.prop, this.value);
    }
    public visit<T>(visitor: ISearchQueryElementVisitor<T>): T {
        return visitor.visitStringValuePropertySearchQueryElement(this);
    }
}
export interface ISearchQueryElementFromJSONContext {
    DateRangeFromJSON(json: any): IDateRange;
    SearchQueryFromJSON(searchQuery: any): SearchQuery;
    SearchQueryElementFromJSON(childJson: any): ISearchQueryElement;
    GetDateRangeTranslator(): IDateRangeTranslator;
    GetPropertyNameService(): PropertyNameService_t;
    GetWordTranslator(): (toTranslate: string) => string;
}

export interface ISearchQueryElementParseFromJSON { (jsonData: any, context: ISearchQueryElementFromJSONContext): ISearchQueryElement; }

export interface ISearchQueryElementVisitor<T> {
    visitStringValuePropertySearchQueryElement(query: StringValuePropertySearchQueryElement): T;
    visitDatePropertySearchQueryElement(query: DatePropertySearchQueryElement): T;
    visitAllSimpleSearchQueryElement(query: AllSimpleSearchQueryElement): T;
    visitFolderSearchQueryElement(query: FolderSearchQueryElement): T;
    visitTextSearchQueryElement(query: TextSearchQueryElement): T;
    visitReferenceSimpleSearchQueryElement(query: ReferenceSimpleSearchQueryElement): T;
    visitOrSearchQueryElement(query: OrSearchQueryElement): T;
    visitAndSearchQueryElement(query: AndSearchQueryElement): T;
}
