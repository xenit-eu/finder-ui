import * as debug from "debug";
import { IDateRange, IDateRangeTranslator } from "./DateRange";
import { ISynchronousTranslationService } from "./searchquery";
import { SearchQueryElementReadableStringVisitor } from "./SearchQueryElementReadableStringVisitor";
import { SearchQueryFactory } from "./SearchQueryFactory";
import { ALL, ASPECT, NODEREF, TEXT, TYPE } from "../WordTranslator";
import { Facet_Value_t } from '../facets';
import { GetSizeTranslation, DocumentSizeRange_t } from "./../documentSize";
const d = debug("finder-ui:finderquery");

// This is a fake type. The document type is mapped to this QName to be able to put all document information in a hashmap.
export const TYPE_QNAME = "{http://www.alfresco.org/model/content/1.0}type";
export type ISynchronousTranslationService = (s: string) => string;
export type IASynchronousTranslationService = (s: string) => Promise<string>;
export type IRetrievePathOfFolder = (noderef: string) => Promise<{ qnamePath: string, displayPath: string }>;
export class SearchQuery {
    private readabler: SearchQueryElementReadableStringVisitor;
    public constructor(public readonly elements: ReadonlyArray<ISearchQueryElement>, private readonly translate: ISynchronousTranslationService) {
        this.readabler = new SearchQueryElementReadableStringVisitor(translate);
    }
    public ToJSON(searchQueryElementToJSON: (e: ISearchQueryElement) => any): any {
        return { elements: this.elements.map(searchQueryElementToJSON) };
    }

    public HumanReadableText() {
        return this.GetRootSearchQueryElement().visit(this.readabler);
    }
    public GetRootSearchQueryElement(): ISearchQueryElement {
        return this.elements.length === 1 ? this.elements[0] : new AndSearchQueryElement(this.elements, () => this.translate(AndSearchQueryElement.AND));
    }
    public ToAndQueryElement(): AndSearchQueryElement {
        return new AndSearchQueryElement(this.elements, () => this.translate(AndSearchQueryElement.AND));
    }
    public CreateFromChildren(children: ReadonlyArray<ISearchQueryElement>) {
        return new SearchQuery(children, this.translate);
    }

    public equals(q: SearchQuery) {
        return this.GetRootSearchQueryElement().equals(q.GetRootSearchQueryElement());
    }
}

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
    getTooltipText(): Promise<string>;
    readonly TYPE: string;
    isRemovable(): boolean;
    getSimpleSearchbarText(): Promise<string>;
    isReferential(): boolean;
}
export interface ISimpleSearchQueryElement extends ISearchQueryElement {
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
        return context.searchQueryFactory().buildTextQueryElement(typecheckSafety.text);
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
export class SizeQueryElement implements ISimpleSearchQueryElement {
    public static readonly TYPE = "SizeQueryElement";
    public readonly TYPE = SizeQueryElement.TYPE;
    public static ParseFromJSON(json: any, context: ISearchQueryElementFromJSONContext) {
        const typecheckSafety: SizeQueryElement = json;
        return context.searchQueryFactory().buildSizeQueryElement(typecheckSafety.range);
    }
    public constructor(public range: DocumentSizeRange_t, private readonly translate: ISynchronousTranslationService) {
    }
    public isReferential() { return false; }
    public isRemovable() { return true; }
    public getSimpleSearchbarText() {
        const ret = this.translate("Size") + ": " + GetSizeTranslation((s) => this.translate(s),this.range);
        return Promise.resolve(ret);
    }
    public getTooltipText() {
        return this.getSimpleSearchbarText();
    }
    public visit<T>(visitor: ISearchQueryElementVisitor<T>): T {
        return visitor.visitSizeQueryElement(this);
    }
    public conflictsWith(other: ISearchQueryElement): boolean {
        return (other instanceof SizeQueryElement);
    }

    public equals(other: ISearchQueryElement): boolean {
        return other instanceof SizeQueryElement && other.range.end === this.range.end && other.range.start === this.range.start;
    }
}
export class AspectSearchQueryElement implements ISimpleSearchQueryElement {
    public static readonly TYPE = "AspectSearchQueryElement";
    public readonly TYPE = AspectSearchQueryElement.TYPE;
    public static ParseFromJSON(json: any, context: ISearchQueryElementFromJSONContext) {
        const typecheckSafety: AspectSearchQueryElement = json;
        return context.searchQueryFactory().buildAspectQueryElement(typecheckSafety.aspect);
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
        return context.searchQueryFactory().buildTypeQueryElement(typecheckSafety.pType);
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
        return context.searchQueryFactory().buildFolderQueryElement(typecheckSafety.noderef);
    }
    public isReferential() { return false; }
    public isRemovable() { return true; }
    //public readonly qnamePath: string, public readonly displayPath: string,
    private cachedDisplayPath: string | undefined;
    private cachedQnamePath: string | undefined;
    private loadPaths() {

    }
    public getDisplayPath(): Promise<string> {
        return this.cachedDisplayPath ? Promise.resolve(this.cachedDisplayPath) : this.getPaths().then(() => "" + this.cachedDisplayPath);
    }
    public getQnamePath(): Promise<string> {
        return this.cachedQnamePath ? Promise.resolve(this.cachedQnamePath) : this.getPaths().then(() => "" + this.cachedQnamePath);
    }
    private getPaths(): Promise<void> {
        return this.retrievePath(this.noderef).then(p => {
            this.cachedQnamePath = p.qnamePath;
            this.cachedDisplayPath = p.displayPath;
        });
    }

    constructor(public readonly noderef: string, private retrievePath: IRetrievePathOfFolder, private readonly translationService: ISynchronousTranslationService) {
        //displayPath here means (the alfresco displayPath + "/"  + name), but no '/' in the begin, so for example: "Company Home/Data Dictionary"
    }
    public getSimpleSearchbarText() {
        return this.getDisplayPath().then(displayPath => this.translationService("Folder") + ":" + displayPath);
    }
    public getTooltipText() {
        return this.getDisplayPath();
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
        return context.searchQueryFactory().buildAllQueryElement(typecheckSafety.value, typecheckSafety.isUnremovable);
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

    public equals(other: ISearchQueryElement): boolean {
        return (other instanceof AllSimpleSearchQueryElement) && (other.value === this.value) && (other.isUnremovable === this.isUnremovable);
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
        return context.searchQueryFactory().buildDatePropertyQueryElement(typecheckSafety.key, context.DateRangeFromJSON(json.dateRange));
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
        return context.searchQueryFactory().buildNodeQueryElement(typecheckSafety.noderef);
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
export interface HierarchicSearchQueryElement<T> {
    getChildren(): ReadonlyArray<ISearchQueryElement>;
    withChildren(children: ReadonlyArray<ISearchQueryElement>): T;
}
export function isHierarchicSearchQueryElement(element: ISearchQueryElement):
    element is (OrSearchQueryElement | AndSearchQueryElement) {
    return element instanceof AndSearchQueryElement || element instanceof OrSearchQueryElement;
}

export function containsToFillInSearchQueryElement(element: ISearchQueryElement): boolean {
    if (element instanceof ToFillInSearchQueryElement) {
        return true;
    }
    if (isHierarchicSearchQueryElement(element)) {
        return element.getChildren().some(elem => containsToFillInSearchQueryElement(elem));
    }
    return false;
}
export class AndSearchQueryElement implements ISearchQueryElement, HierarchicSearchQueryElement<AndSearchQueryElement> {

    public getTooltipText(): Promise<string> {
        return Promise.all(this.children.map(c => c.getTooltipText())).then(childTexts => childTexts.join(this.getConnectWord()));
    }
    public getConnectWord() {
        return this.getAndText(AndSearchQueryElement.AND);
    }
    public isRemovable(): boolean {
        return true;
    }
    public getSimpleSearchbarText(): Promise<string> {
        return this.getTooltipText();
    }
    public isReferential(): boolean {
        return false;
    }
    public getChildren(): ReadonlyArray<ISearchQueryElement> {
        return this.children;
    }
    public withChildren(children: ReadonlyArray<ISearchQueryElement>) {
        return new AndSearchQueryElement(children, this.getAndText);
    }
    public static readonly TYPE = "AndSearchQueryElement";
    public readonly TYPE = AndSearchQueryElement.TYPE;
    public static readonly AND = "and";
    public getHierarchicType(): "and" {
        return AndSearchQueryElement.AND;
    }
    public static ParseFromJSON(json: any, context: ISearchQueryElementFromJSONContext) {
        const typecheckSafety: AndSearchQueryElement = json;
        return context.searchQueryFactory().buildAndQueryElement(typecheckSafety.children.map(e => context.SearchQueryElementFromJSON(e)));
    }
    constructor(public readonly children: ReadonlyArray<ISearchQueryElement>, public readonly getAndText: (and: string) => string) {
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
export class OrSearchQueryElement implements ISearchQueryElement, HierarchicSearchQueryElement<OrSearchQueryElement> {
    public static readonly OR = "or";
    public getTooltipText(): Promise<string> {
        return Promise.all(this.children.map(c => c.getTooltipText())).then(childTexts => childTexts.join(this.getConnectWord()));
    }
    public getConnectWord() {
        return this.getOrText(OrSearchQueryElement.OR);
    }
    public isRemovable(): boolean {
        return true;
    }
    public getSimpleSearchbarText(): Promise<string> {
        return this.getTooltipText();
    }
    public isReferential(): boolean {
        return false;
    }
    public getHierarchicType(): "or" {
        return OrSearchQueryElement.OR;
    }

    public getChildren(): ReadonlyArray<ISearchQueryElement> {
        return this.children;
    }
    public withChildren(children: ReadonlyArray<ISearchQueryElement>) {
        return new OrSearchQueryElement(children, this.getOrText);
    }

    public static readonly TYPE = "OrSearchQueryElement";
    public readonly TYPE = OrSearchQueryElement.TYPE;
    public static ParseFromJSON(json: any, context: ISearchQueryElementFromJSONContext) {
        const typecheckSafety: OrSearchQueryElement = json;
        return context.searchQueryFactory().buildOrQueryElement(typecheckSafety.children.map(e => context.SearchQueryElementFromJSON(e)));
    }
    constructor(public readonly children: ReadonlyArray<ISearchQueryElement>, public readonly getOrText: (or: string) => string) {
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
        return context.searchQueryFactory().buildStringValuePropertyQueryElement(typecheckSafety.key, typecheckSafety.value);
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

export class ToFillInSearchQueryElement implements ISimpleSearchQueryElement {
    public conflictsWith(other: ISearchQueryElement): boolean {
        return other instanceof ToFillInSearchQueryElement;
    }
    public static readonly TYPE = "ToFillInSearchQueryElement";
    public readonly TYPE = ToFillInSearchQueryElement.TYPE;
    public static ParseFromJSON(json: any, context: ISearchQueryElementFromJSONContext) {
        const typecheckSafety: ToFillInSearchQueryElement = json;
        return context.searchQueryFactory().buildToFillInQueryElement();
    }
    constructor() {
    }
    public getSimpleSearchbarText() {
        return Promise.resolve("...");
    }
    public getTooltipText() {
        return this.getSimpleSearchbarText();
    }
    public visit<T>(visitor: ISearchQueryElementVisitor<T>): T {
        return visitor.visitToFillInSearchQueryElement(this);
    }
    public equals(other: ISearchQueryElement): boolean {
        return other instanceof ToFillInSearchQueryElement;
    }
    public isReferential() {
        return false;
    }
    public isRemovable() {
        return true;
    }
}

export interface ISearchQueryElementFromJSONContext {
    DateRangeFromJSON(json: any): IDateRange;
    SearchQueryFromJSON(searchQuery: any): SearchQuery;
    SearchQueryElementFromJSON(childJson: any): ISearchQueryElement;
    searchQueryFactory(): SearchQueryFactory;
}

export type ISearchQueryElementParseFromJSON = (jsonData: any, context: ISearchQueryElementFromJSONContext) => ISearchQueryElement;

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
    visitToFillInSearchQueryElement(query: ToFillInSearchQueryElement): T;
    visitSizeQueryElement(query: SizeQueryElement): T;
}
