import * as debug from "debug";
import { IDateRange, IDateRangeTranslator } from "./DateRange";
import { ISynchronousTranslationService } from "./searchquery";
import { SearchQueryElementReadableStringVisitor } from "./SearchQueryElementReadableStringVisitor";
import { ALL, ASPECT, NODEREF, TEXT, TYPE } from "./WordTranslator";
const d = debug("finder-ui:finderquery");

// This is a fake type. The document type is mapped to this QName to be able to put all document information in a hashmap.
export const TYPE_QNAME = "{http://www.alfresco.org/model/content/1.0}type";
export interface ISynchronousTranslationService { (s: string): string; }
export class SearchQuery {
    private readabler: SearchQueryElementReadableStringVisitor;
    public constructor(public readonly elements: ISearchQueryElement[], readonly translate: ISynchronousTranslationService) {
        this.readabler = new SearchQueryElementReadableStringVisitor(translate);
    }
    public ToJSON(searchQueryElementToJSON: (e: ISearchQueryElement) => any): any {
        return { elements: this.elements.map(searchQueryElementToJSON) };
    }

    public HumanReadableText() {
        return this.GetRootSearchQueryElement().visit(this.readabler);
    }
    public GetRootSearchQueryElement(): ISearchQueryElement {
        return this.elements.length === 1 ? this.elements[0] : new AndSearchQueryElement(this.elements);
    }

    public equals(q: SearchQuery) {
        return this.GetRootSearchQueryElement().equals(q.GetRootSearchQueryElement());
    }
}

export interface IASynchronousTranslationService { (s: string): Promise<string>; }
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
    equals(other: ISearchQueryElement): boolean;
    readonly TYPE: string;
}
export interface ISimpleSearchQueryElement extends ISearchQueryElement {
    getSimpleSearchbarText(): Promise<string>;
    getTooltipText(): Promise<string>;
    isReferential(): boolean;
    isRemovable(): boolean;
}

export class ReferenceSimpleSearchQueryElement implements ISimpleSearchQueryElement {
    public static readonly TYPE = "ReferenceSimpleSearchQueryElement";
    public readonly TYPE = ReferenceSimpleSearchQueryElement.TYPE;
    public static ParseFromJSON(json: any, context: ISearchQueryElementFromJSONContext) {
        const typecheckSafety: ReferenceSimpleSearchQueryElement = json;
        return new ReferenceSimpleSearchQueryElement(context.SearchQueryFromJSON(typecheckSafety.wrappedQuery), typecheckSafety.name);
    }
    public getSimpleSearchbarText() {
        return Promise.resolve(this.name);
    }
    public getTooltipText() {
        return Promise.resolve(this.name);
    }
    public constructor(public readonly wrappedQuery: SearchQuery, public readonly name: string) {
    }
    public isReferential() { return true; }
    public isRemovable() { return true; }

    public visit<T>(visitor: ISearchQueryElementVisitor<T>): T {
        return visitor.visitReferenceSimpleSearchQueryElement(this);
    }
    public conflictsWith(other: ISearchQueryElement) {
        return this.wrappedQuery.GetRootSearchQueryElement().conflictsWith(other);
    }

    public equals(other: ISearchQueryElement): boolean {
        return other instanceof ReferenceSimpleSearchQueryElement && other.name === this.name && this.wrappedQuery.equals(other.wrappedQuery);
    }
}

export class TextSearchQueryElement implements ISimpleSearchQueryElement {
    public static readonly TYPE = "TextSearchQueryElement";
    public readonly TYPE = TextSearchQueryElement.TYPE;
    public static ParseFromJSON(json: any, context: ISearchQueryElementFromJSONContext) {
        const typecheckSafety: TextSearchQueryElement = json;
        return new TextSearchQueryElement(typecheckSafety.text, context.GetWordTranslator());
    }
    public constructor(public readonly text: string, private readonly translationService: ISynchronousTranslationService) {
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
    public equals(other: ISearchQueryElement): boolean {
        return other instanceof TextSearchQueryElement && other.text === this.text;
    }

}

export class AspectSearchQueryElement implements ISimpleSearchQueryElement {
    public static readonly TYPE = "AspectSearchQueryElement";
    public readonly TYPE = AspectSearchQueryElement.TYPE;
    public static ParseFromJSON(json: any, context: ISearchQueryElementFromJSONContext) {
        const typecheckSafety: AspectSearchQueryElement = json;
        return new AspectSearchQueryElement(typecheckSafety.aspect, context.GetWordTranslator(), context.GetAspectNameTranslator());
    }
    public constructor(public readonly aspect: string, private readonly translateAspect: ISynchronousTranslationService, private readonly translateAspectName: IASynchronousTranslationService) {
    }
    public isReferential() { return false; }
    public isRemovable() { return true; }

    public getSimpleSearchbarText() {
        return this.translateAspectName(this.aspect).then(translatedAspect => this.translateAspect(ASPECT) + ": " + translatedAspect);
    }
    public getTooltipText() {
        return this.getSimpleSearchbarText();
    }
    public visit<T>(visitor: ISearchQueryElementVisitor<T>): T {
        return visitor.visitAspectSearchQueryElement(this);
    }
    public conflictsWith(other: ISearchQueryElement): boolean {
        return (other instanceof AspectSearchQueryElement) && (other.aspect === this.aspect);
    }

    public equals(other: ISearchQueryElement): boolean {
        return other instanceof AspectSearchQueryElement && other.aspect === this.aspect;
    }

}
export class TypeSearchQueryElement implements ISimpleSearchQueryElement {
    public static readonly TYPE = "TYPESearchQueryElement";
    public readonly TYPE = TypeSearchQueryElement.TYPE;
    public static ParseFromJSON(json: any, context: ISearchQueryElementFromJSONContext) {
        const typecheckSafety: TypeSearchQueryElement = json;
        return new TypeSearchQueryElement(typecheckSafety.pType, context.GetWordTranslator(), context.GetTypeNameTranslator());
    }
    public constructor(public readonly pType: string, private readonly translateType: ISynchronousTranslationService, private readonly translateTypeName: IASynchronousTranslationService) {
    }
    public isReferential() { return false; }
    public isRemovable() { return true; }

    public getSimpleSearchbarText() {
        return this.translateTypeName(this.pType).then(translatedType => this.translateType(TYPE) + ": " + translatedType);
    }
    public getTooltipText() {
        return this.getSimpleSearchbarText();
    }
    public visit<T>(visitor: ISearchQueryElementVisitor<T>): T {
        return visitor.visitTypeSearchQueryElement(this);
    }
    public conflictsWith(other: ISearchQueryElement): boolean {
        return (other instanceof TypeSearchQueryElement) && (other.pType === this.pType);
    }

    public equals(other: ISearchQueryElement): boolean {
        return other instanceof TypeSearchQueryElement && other.pType === this.pType;
    }

}

export class FolderSearchQueryElement implements ISimpleSearchQueryElement {
    public static readonly TYPE = "FolderSearchQueryElement";
    public readonly TYPE = FolderSearchQueryElement.TYPE;
    public static ParseFromJSON(json: any, context: ISearchQueryElementFromJSONContext) {
        const typecheckSafety: FolderSearchQueryElement = json;
        return new FolderSearchQueryElement(typecheckSafety.qnamePath, typecheckSafety.displayPath, context.GetWordTranslator(), typecheckSafety.noderef);
    }
    public isReferential() { return false; }
    public isRemovable() { return true; }

    constructor(public readonly qnamePath: string, public readonly displayPath: string, private readonly translationService: ISynchronousTranslationService, public readonly noderef: string) {
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

    public equals(other: ISearchQueryElement): boolean {
        return other instanceof FolderSearchQueryElement && other.noderef === this.noderef;
    }
}

export class AllSimpleSearchQueryElement implements ISimpleSearchQueryElement {
    public static readonly TYPE = "AllSimpleSearchQueryElement";
    public readonly TYPE = AllSimpleSearchQueryElement.TYPE;
    public static ParseFromJSON(json: any, context: ISearchQueryElementFromJSONContext) {
        const typecheckSafety: AllSimpleSearchQueryElement = json;
        return new AllSimpleSearchQueryElement(context.GetWordTranslator(), typecheckSafety.value, typecheckSafety.isUnremovable);
    }

    constructor(private readonly AllWordtranslationService: ISynchronousTranslationService, public readonly value: string, public readonly isUnremovable = false) {
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

    public equals(other: ISearchQueryElement) {
        return other instanceof AllSimpleSearchQueryElement;
    }
}
export abstract class PropertySearchQueryElement implements ISimpleSearchQueryElement {
    constructor(public readonly key: string, private readonly propertyNameService: IPropertyKeyNameService) {
        if (!key || key.length === 0) {
            throw new Error("Key should be a valid property key");
        }
    }
    protected abstract GetValueSimpleSearchbarText(): Promise<string>;
    public abstract equals(other: ISearchQueryElement): boolean;
    public abstract readonly TYPE: string;
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
    public readonly TYPE = DatePropertySearchQueryElement.TYPE;
    public static ParseFromJSON(json: any, context: ISearchQueryElementFromJSONContext) {
        const typecheckSafety: DatePropertySearchQueryElement = json;
        return new DatePropertySearchQueryElement(typecheckSafety.key, context.DateRangeFromJSON(json.dateRange), context.GetDateRangeTranslator(), context.GetPropertyNameService());
    }
    constructor(qname: string, public readonly dateRange: IDateRange, private readonly DateRangeTranslator: IDateRangeTranslator, propertyNameService: IPropertyKeyNameService) {
        super(qname, propertyNameService);
    }
    protected GetValueSimpleSearchbarText() {
        return Promise.resolve(this.dateRange.ToHumanReadableString(this.DateRangeTranslator));
    }
    public visit<T>(visitor: ISearchQueryElementVisitor<T>): T {
        return visitor.visitDatePropertySearchQueryElement(this);
    }
    public equals(other: ISearchQueryElement): boolean {
        return other instanceof DatePropertySearchQueryElement && other.key === this.key && this.dateRange.equals(other.dateRange);
    }
}
export class NodeRefSearchQueryElement implements ISimpleSearchQueryElement {
    public static readonly TYPE = "NodeRefSearchQueryElement";
    public readonly TYPE = NodeRefSearchQueryElement.TYPE;
    public static ParseFromJSON(json: any, context: ISearchQueryElementFromJSONContext) {
        const typecheckSafety: NodeRefSearchQueryElement = json;
        return new NodeRefSearchQueryElement(typecheckSafety.noderef, context.GetWordTranslator());
    }
    public constructor(public readonly noderef: string, private readonly wordTranslator: ISynchronousTranslationService) {
    }
    public getSimpleSearchbarText(): Promise<string> {
        return Promise.resolve(this.wordTranslator(NODEREF) + ": " + this.noderef);
    }
    public getTooltipText(): Promise<string> {
        return this.getSimpleSearchbarText();
    }
    public isReferential(): boolean {
        return false;
    }
    public isRemovable(): boolean {
        return true;
    }
    public conflictsWith(other: ISearchQueryElement): boolean {
        return other instanceof NodeRefSearchQueryElement;
    }
    public visit<T>(visitor: ISearchQueryElementVisitor<T>): T {
        return visitor.visitNodeRefSearchQueryElement(this);
    }

    public equals(other: ISearchQueryElement): boolean {
        return other instanceof NodeRefSearchQueryElement && other.noderef === this.noderef;
    }
}

export class AndSearchQueryElement implements ISearchQueryElement {
    public static readonly TYPE = "AndSearchQueryElement";
    public readonly TYPE = AndSearchQueryElement.TYPE;
    public static ParseFromJSON(json: any, context: ISearchQueryElementFromJSONContext) {
        const typecheckSafety: AndSearchQueryElement = json;
        return new AndSearchQueryElement(typecheckSafety.children.map(e => context.SearchQueryElementFromJSON(e)));
    }
    constructor(public readonly children: ISearchQueryElement[]) {
    }
    public visit<T>(visitor: ISearchQueryElementVisitor<T>): T {
        return visitor.visitAndSearchQueryElement(this);
    }
    public conflictsWith(other: ISearchQueryElement) {
        return false;
    }

    public equals(other: ISearchQueryElement): boolean {
        if (!(other instanceof AndSearchQueryElement)) {
            return false;
        }
        if (this.children.length !== other.children.length) {
            return false;
        }

        for (let i = 0; i < this.children.length; i++) {
            if (!this.children[i].equals(other.children[i])) {
                return false;
            }
        }
        return true;
    }
}
export class OrSearchQueryElement implements ISearchQueryElement {

    public static readonly TYPE = "OrSearchQueryElement";
    public readonly TYPE = OrSearchQueryElement.TYPE;
    public static ParseFromJSON(json: any, context: ISearchQueryElementFromJSONContext) {
        const typecheckSafety: OrSearchQueryElement = json;
        return new OrSearchQueryElement(typecheckSafety.children);
    }
    constructor(public readonly children: ISearchQueryElement[]) {
    }
    public visit<T>(visitor: ISearchQueryElementVisitor<T>): T {
        return visitor.visitOrSearchQueryElement(this);
    }
    public conflictsWith(other: ISearchQueryElement) {
        return false;
    }

    public equals(other: ISearchQueryElement): boolean {
        if (!(other instanceof OrSearchQueryElement)) {
            return false;
        }
        if (this.children.length !== other.children.length) {
            return false;
        }

        for (let i = 0; i < this.children.length; i++) {
            if (!this.children[i].equals(other.children[i])) {
                return false;
            }
        }
        return true;
    }

}

export class StringValuePropertySearchQueryElement extends PropertySearchQueryElement {
    public static readonly TYPE = "StringValuePropertySearchQueryElement";
    public readonly TYPE = StringValuePropertySearchQueryElement.TYPE;
    public static ParseFromJSON(json: any, context: ISearchQueryElementFromJSONContext) {
        const typecheckSafety: StringValuePropertySearchQueryElement = json;
        return new StringValuePropertySearchQueryElement(typecheckSafety.key, typecheckSafety.value, context.GetPropertyNameService());
    }
    constructor(prop: string, public readonly value: string, private readonly pNameService: PropertyNameService_t) {
        super(prop, pNameService);
    }
    protected GetValueSimpleSearchbarText() {
        return this.pNameService.translatePropertyValue(this.key, this.value);
    }
    public visit<T>(visitor: ISearchQueryElementVisitor<T>): T {
        return visitor.visitStringValuePropertySearchQueryElement(this);
    }
    public equals(other: ISearchQueryElement): boolean {
        return other instanceof StringValuePropertySearchQueryElement && this.key === other.key && this.value === other.value;
    }
}
export interface ISearchQueryElementFromJSONContext {
    DateRangeFromJSON(json: any): IDateRange;
    SearchQueryFromJSON(searchQuery: any): SearchQuery;
    SearchQueryElementFromJSON(childJson: any): ISearchQueryElement;
    GetDateRangeTranslator(): IDateRangeTranslator;
    GetPropertyNameService(): PropertyNameService_t;
    GetWordTranslator(): ISynchronousTranslationService;
    GetAspectNameTranslator(): IASynchronousTranslationService;
    GetTypeNameTranslator(): IASynchronousTranslationService;

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
    visitAspectSearchQueryElement(query: AspectSearchQueryElement): T;
    visitNodeRefSearchQueryElement(query: NodeRefSearchQueryElement): T;
    visitTypeSearchQueryElement(query: TypeSearchQueryElement): T;
}
