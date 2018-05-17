import * as debug from "debug";
const d = debug("finder-ui:finderquery");

// This is a fake type. The document type is mapped to this QName to be able to put all document information in a hashmap.
export const TYPE_QNAME = "{http://www.alfresco.org/model/content/1.0}type";

export interface ISearchQuery {
    HumanReadableText(): Promise<string>;
}
export class SimpleSearchQuery implements ISearchQuery {
    constructor(public elements: ISimpleSearchQueryElement[]) {
    }
    public HumanReadableText() {
        return Promise.all(this.elements.map(e => e.getSimpleSearchbarText())).then(texts => texts.join());
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
}

export interface ISimpleSearchQueryElement {
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
}

export class AllSimpleSearchQueryElement implements ISimpleSearchQueryElement {
    constructor(private translationService: TranslationService_t, private value: string) {
    }
    public getSimpleSearchbarText() {
        return this.translationService("All").then(f => f + ":" + this.value);
    }
    public getTooltipText() {
        return this.getSimpleSearchbarText();
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
    public getTooltipText() {
        return this.getSimpleSearchbarText();
    }
}
export class DatePropertySearchQueryElement extends PropertySearchQueryElement {
    private rangeTranslator: DateRangeTranslator;
    constructor(qname: string, public dateRange: IDateRange, propertyNameService: PropertyKeyNameService_t, translationService: TranslationService_t) {
        super(qname, propertyNameService);
        this.rangeTranslator = new DateRangeTranslator(translationService);
    }
    protected GetValueSimpleSearchbarText() {
        return this.rangeTranslator.translateDateRange(this.dateRange);
    }
}
export class EnumPropertySearchQueryElement extends PropertySearchQueryElement {
    constructor(private prop: string, private value: string, private pNameService: PropertyNameService_t) {
        super(prop, pNameService);
    }
    protected GetValueSimpleSearchbarText() {
        return this.pNameService.translatePropertyValue(this.prop, this.value);
    }
}
export class DateRangeTranslator {
    constructor(public translationService: TranslationService_t) {

    }
    private arrow = "\u2192";
    private translateDate(date: Date) {
        return date.toLocaleDateString();
    }
    public translateDateRange(range: IDateRange) {
        const from = range.From;
        const to = range.To;
        return (from === "MIN") ?
            to === "MAX" ?
                this.translationService("Always") :
                this.translationService("Until").then(l => l + " " + this.translateDate(to)) :
            to === "MAX" ?
                this.translationService("From").then(l => l + " " + this.translateDate(from)) :
                Promise.resolve(this.translateDate(from) + " " + this.arrow + " " + this.translateDate(to));
    }
}

export interface IDateRange {
    From: "MIN" | Date;
    To: "MAX" | Date;
}
