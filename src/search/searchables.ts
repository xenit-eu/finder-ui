import {
    DATE_BETWEEN, DateRangeSearchables, DATE_FROM, DATE_ON, DATE_UNTIL, FromDateRange, IDateRange,
    IDateRangeTranslator, SimpleDateRange, UntilDateRange,
} from "./DateRange";
import {
    AllSimpleSearchQueryElement, DatePropertySearchQueryElement, IPropertyKeyNameService, ISearchQueryElement,
    ISimpleSearchQueryElement, ISynchronousTranslationService, PropertyNameService_t, ReferenceSimpleSearchQueryElement,
    SearchQuery, StringValuePropertySearchQueryElement, TextSearchQueryElement,
} from "./searchquery";
import { IFolderSearchQueryElementFactory } from "./SearchQueryFactory";
import { ALL, FOLDER, TEXT } from "./WordTranslator";
export interface ISearchableQueryElement {
    matchKeyValue(key: string, value: string): Promise<IExactValueMatch>;
    getPartiallyMatchingAutocompleteListElements(key: string, value: string): Promise<ReadonlyArray<IAutocompleteSuggestion>>;
}

function ExistsFilter<T>(elements: (T | undefined | null | void)[]) {
    return elements.filter(element => element) as T[];
}
function trimLowercase(s: string) {
    return s.trim().toLowerCase();
}
export function lowercaseTrimContains(full: string, part: string) {
    if (XOR(isNullOrUndefined(full), isNullOrUndefined(part))) {
        return false;
    }
    if (isNullOrUndefined(full) && isNullOrUndefined(part)) {
        return true;
    }
    return trimLowercase(full).indexOf(trimLowercase(part)) >= 0;
}
function XOR(a: boolean, b: boolean) {
    return (a || b) && !(a && b);
}
function isNullOrUndefined(a: string | null | undefined) {
    return a === undefined || a === null;
}
export function lowercaseTrimEquals(a: string, b: string) {
    if (XOR(isNullOrUndefined(a), isNullOrUndefined(b))) {
        return false;
    }
    if (isNullOrUndefined(a) && isNullOrUndefined(b)) {
        return true;
    }
    return trimLowercase(a) === trimLowercase(b);
}
function empty(s: string | undefined) {
    return !s || s.trim().length === 0;
}
function ContainsOrKeyOrValueOtherEmpty(key: string, value: string, container: string) {
}
export class ReferenceSearchableQueryElement implements ISearchableQueryElement {
    public constructor(public name: string, public wrappedQuery: SearchQuery) {
    }

    private createAutocompleteListElement(): IAutocompleteSuggestion {
        return new SimpleAutoCompleteListElement("", this.name, this.name);
    }

    public getPartiallyMatchingAutocompleteListElements(key: string, value: string): Promise<IAutocompleteSuggestion[]> {
        const onlyValueMatches = empty(key) && lowercaseTrimContains(this.name, value);
        const onlyKeyMatches = empty(value) && lowercaseTrimContains(this.name, key);
        return Promise.resolve(onlyKeyMatches || onlyKeyMatches ? [this.createAutocompleteListElement()] : []);
    }

    public matchKeyValue(key: string, value: string): Promise<SimpleSearchQueryElementValueMatch | NoResultValueMatch> {
        const matches = empty(key) && lowercaseTrimEquals(value, this.name);
        return Promise.resolve(matches ?
            new SimpleSearchQueryElementValueMatch(new ReferenceSimpleSearchQueryElement(this.wrappedQuery, this.name)) : new NoResultValueMatch());
    }
}

export class AllSearchable implements ISearchableQueryElement {
    constructor(private AllwordTranslationService: ISynchronousTranslationService) {
    }

    public matchKeyValue(key: string, value: string): Promise<IExactValueMatch> {
        return Promise.resolve(this.AllwordTranslationService(ALL)).then(translatedAll => lowercaseTrimEquals(translatedAll, key) || lowercaseTrimEquals("", key) ?
            new SimpleSearchQueryElementValueMatch(new AllSimpleSearchQueryElement(this.AllwordTranslationService, value)) : new NoResultValueMatch());
    }
    public getPartiallyMatchingAutocompleteListElements(key: string, value: string): Promise<IAutocompleteSuggestion[]> {
        return Promise.resolve(this.AllwordTranslationService(ALL)).then(translatedAll => lowercaseTrimContains(translatedAll, key) || lowercaseTrimContains("", key) ?
            [new SimpleAutoCompleteListElement(translatedAll, value, translatedAll + ":" + value)] : []);
    }
}

export abstract class PropertySearchable implements ISearchableQueryElement {
    public constructor(public qname: string, protected propertykeyNameService: IPropertyKeyNameService) {
    }
    public matchKeyValue(key: string, value: string): Promise<IExactValueMatch> {
        return this.propertykeyNameService.translatePropertyKey(this.qname).then(tQName => {
            return lowercaseTrimEquals(key, tQName) ? this.matchesValueExact(value) : new NoResultValueMatch();
        });
    }
    public abstract getPartiallyMatchingAutocompleteListElements(key: string, value: string): Promise<IAutocompleteSuggestion[]>;

    protected abstract matchesValueExact(value: string): Promise<IExactValueMatch>;
}
export type EnumPropertySearchableValue_t = string;
export class EnumPropertySearchable extends PropertySearchable {
    constructor(prop: string, private values: EnumPropertySearchableValue_t[], private propertyNameService: PropertyNameService_t) {
        super(prop, propertyNameService);
    }
    public updateValues(values: EnumPropertySearchableValue_t[]) {
        this.values = values;
    }
    protected matchesValueExact(val: string) {
        const match: EnumPropertySearchableValue_t | undefined = this.values.filter(v => lowercaseTrimEquals(v, val))[0]; //TODO INCORRECT => no translations used.
        const unfilteredP = Promise.all(this.values.map(v => {
            return this.propertyNameService.translatePropertyValue(this.qname, v).then(tValue =>
                lowercaseTrimEquals(tValue, val) ? new SimpleSearchQueryElementValueMatch(new StringValuePropertySearchQueryElement(this.qname, v, this.propertyNameService)) : undefined);
        }));

        return unfilteredP.then(unfiltered => {
            const filtered = ExistsFilter(unfiltered);
            return filtered.length > 0 ? filtered[0] : new NoResultValueMatch();
        });
    }
    public getPartiallyMatchingAutocompleteListElements(key: string, value: string): Promise<IAutocompleteSuggestion[]> {
        return this.propertyNameService.translatePropertyKey(this.qname).then(tQName => {
            if (!lowercaseTrimContains(tQName, key)) {
                return Promise.resolve([] as IAutocompleteSuggestion[]);
            }
            const unfilteredP = Promise.all(this.values.map(v => {
                return this.propertyNameService.translatePropertyValue(this.qname, v).then(tValue =>
                    lowercaseTrimContains(tValue, value) ? new SimpleAutoCompleteListElement(tQName, tValue, tQName + ":" + tValue) : undefined);
            }));
            return unfilteredP.then(uf => ExistsFilter<SimpleAutoCompleteListElement>(uf)) as Promise<SimpleAutoCompleteListElement[]>;
        });
    }
}

export class AnyStringValuePropertySearchable extends PropertySearchable {
    constructor(prop: string, private propertyNameService: PropertyNameService_t) {
        super(prop, propertyNameService);
    }
    protected matchesValueExact(val: string) {
        return Promise.resolve(new SimpleSearchQueryElementValueMatch(new StringValuePropertySearchQueryElement(this.qname, val, this.propertyNameService)));
    }
    public getPartiallyMatchingAutocompleteListElements(key: string, value: string): Promise<IAutocompleteSuggestion[]> {
        return this.propertyNameService.translatePropertyKey(this.qname).then(tQName => {
            return lowercaseTrimContains(tQName, key) ? [new SimpleAutoCompleteListElement(tQName, value, tQName + ":" + value)] : [];
        });
    }
}

export class TextSearchable implements ISearchableQueryElement {
    constructor(private text: string, private translationService: ISynchronousTranslationService) {
    }
    public getPartiallyMatchingAutocompleteListElements(key: string, value: string): Promise<IAutocompleteSuggestion[]> {
        return Promise.resolve(this.translationService(TEXT)).then(textTranslated => {
            if (!lowercaseTrimContains(textTranslated, key)) {
                return [] as IAutocompleteSuggestion[];
            }
            return lowercaseTrimContains(this.text, value) ?
                [new SimpleAutoCompleteListElement(textTranslated, this.text, textTranslated + ":" + this.text)] : [];
        });
    }
    public matchKeyValue(key: string, value: string): Promise<IExactValueMatch> {
        return Promise.resolve(this.translationService(TEXT)).then(textTranslated => lowercaseTrimEquals(key, textTranslated) && lowercaseTrimEquals(value, this.text) ?
            new SimpleSearchQueryElementValueMatch(new TextSearchQueryElement(this.text, this.translationService)) : new NoResultValueMatch());
    }
}

export class FolderSearchable implements ISearchableQueryElement {

    constructor(private noderef: string, private displayPath: string, private folderSQEFactory: IFolderSearchQueryElementFactory, private wordTranslationService: ISynchronousTranslationService) {
    }

    public matchKeyValue(key: string, value: string): Promise<IExactValueMatch> {
        return Promise.resolve(this.wordTranslationService(FOLDER)).then(folderTranslated => lowercaseTrimEquals(this.displayPath, value) && lowercaseTrimEquals(key, folderTranslated) ?
            new SimpleSearchQueryElementValueMatch(this.folderSQEFactory.buildFolderQueryElement(this.noderef)) : new NoResultValueMatch());
    }

    public getPartiallyMatchingAutocompleteListElements(key: string, value: string): Promise<IAutocompleteSuggestion[]> {
        return Promise.resolve(this.wordTranslationService(FOLDER)).then(folderTranslated => lowercaseTrimContains(folderTranslated, key) && lowercaseTrimContains(this.displayPath, value) ?
            [new SimpleAutoCompleteListElement(folderTranslated, this.displayPath, folderTranslated + ":" + this.displayPath)] : []);
    }
}

interface IDateFillInType {
    fillInDate(date: Date): IDateRange;
}
const DateFillInOn: IDateFillInType = {
    fillInDate: (date: Date) => new SimpleDateRange(date, date),
};
const DateFillInAfter: IDateFillInType = {
    fillInDate: (date: Date) => new FromDateRange(date),
};
const DateFillInBefore: IDateFillInType = {
    fillInDate: (date: Date) => new UntilDateRange(date),
};

export const DateFillInTypes: IDateFillInType[] = [DateFillInOn, DateFillInAfter, DateFillInBefore];
const DateFillInsearchables = [DATE_ON, DATE_FROM, DATE_UNTIL, DATE_BETWEEN];
export const DateSearchableWords = DateRangeSearchables.map(dRS => dRS.label).concat(DateFillInsearchables);
export type HierachyInformation = {
    requiresUserChoice: boolean,
    possibilities: Array<{
        index: number[],
        structure: ISearchQueryElement,
    }>,
};
export class HierarchicQuerySearchable implements ISearchableQueryElement {

    public constructor(
        private getOrTranslated: () => string,
        private getAndTranslated: () => string,
        public getHierarchyInformation: (type: "and" | "or") => HierachyInformation) {

    }
    public matchKeyValue(key: string, value: string): Promise<IExactValueMatch> {
        if (key) {
            return Promise.resolve(new NoResultValueMatch());
        }
        return Promise.resolve(
            lowercaseTrimEquals(this.getOrTranslated(), value) ? new HierarchicQueryValueMatch("or", this.getHierarchyInformation("or")) :
                lowercaseTrimEquals(this.getAndTranslated(), value) ? new HierarchicQueryValueMatch("and", this.getHierarchyInformation("and")) :
                    new NoResultValueMatch());
    }
    public getPartiallyMatchingAutocompleteListElements(key: string, value: string): Promise<IAutocompleteSuggestion[]> {
        return Promise.resolve(
            [
                lowercaseTrimContains(this.getOrTranslated(), value) ? new SimpleAutoCompleteListElement("", this.getOrTranslated(), this.getOrTranslated()) : undefined,
                lowercaseTrimEquals(this.getAndTranslated(), value) ? new SimpleAutoCompleteListElement("", this.getAndTranslated(), this.getAndTranslated()) : undefined,
            ]
                .filter(e => e).map(e => e as SimpleAutoCompleteListElement));
    }

}

export class DateSearchable extends PropertySearchable {
    constructor(qname: string, private propertyNameService: PropertyNameService_t, private dateRangeTranslator: IDateRangeTranslator) {
        super(qname, propertyNameService);
    }
    private dateWordToAutocompletion(translatedDateWord: string, translatedKey: string) {//TODO More complex check accounting typed date (e.g. typing "on 12/" should be aware of 12th day)
        return new SimpleAutoCompleteListElement(translatedKey, translatedDateWord, translatedKey + ":" + translatedDateWord);
    }
    private dateWordToMatch(dateWord: string): IExactValueMatch {//TODO More complex check accounting typed date (e.g. typing "on 12/" should be aware of 12th day)
        for (const dateRange of DateRangeSearchables) {
            if (dateRange.label === dateWord) {
                return new SimpleSearchQueryElementValueMatch(new DatePropertySearchQueryElement(this.qname,
                    dateRange, this.dateRangeTranslator, this.propertyNameService));
            }
        }
        switch (dateWord) {
            case DATE_ON:
                return new DateFillinValueMatch(this, DateFillInOn);
            case DATE_UNTIL:
                return new DateFillinValueMatch(this, DateFillInBefore);
            case DATE_FROM:
                return new DateFillinValueMatch(this, DateFillInAfter);
            case DATE_BETWEEN:
                return new DateRangeFillinValueMatch(this);
            default:
                return new NoResultValueMatch();
        }
    }

    private textToAutocompletion = {};
    public getPartiallyMatchingAutocompleteListElements(key: string, value: string): Promise<IAutocompleteSuggestion[]> {
        return this.propertyNameService.translatePropertyKey(this.qname).then(keyTrans => {
            if (!lowercaseTrimContains(keyTrans, key)) {
                return [];
            }
            return Promise.all(DateSearchableWords.map(dateWord => this.dateRangeTranslator.translateWord(dateWord)))
                .then(translatedDateValues => ExistsFilter<IAutocompleteSuggestion>(translatedDateValues.map((translatedDateValue, i) =>
                    (lowercaseTrimContains(translatedDateValue, value)) ? this.dateWordToAutocompletion(translatedDateValue, keyTrans) : undefined)));
        });
    }

    protected matchesValueExact(value: string): Promise<IExactValueMatch> {
        return Promise.all(DateSearchableWords.map(dateWord => this.dateRangeTranslator.translateWord(dateWord)))
            .then(translatedDateValues => ExistsFilter<IExactValueMatch>(translatedDateValues.map((translatedDateValue, i) =>
                (lowercaseTrimEquals(translatedDateValue, value)) ? this.dateWordToMatch(DateSearchableWords[i]) : undefined)))
            .then(validMatches => validMatches.length > 0 ? validMatches[0] : new NoResultValueMatch());
    }

    public fillInRange(dRange: IDateRange): DatePropertySearchQueryElement {
        return new DatePropertySearchQueryElement(this.qname, dRange, this.dateRangeTranslator, this.propertyNameService);

    }
}
export enum InputHandleRequired {
    dateRange, dateSingle, none, hierarchicSelection,
}
export interface IExactValueMatch {
    requiredDateHandle(): InputHandleRequired;
    hasResult(): boolean;
    isHierarchic(): boolean;
}
export class SimpleSearchQueryElementValueMatch implements IExactValueMatch {
    //public type: "SimpleSearchQueryElementValueMatch" = "SimpleSearchQueryElementValueMatch"
    constructor(public simpleSearchQueryElement: ISimpleSearchQueryElement) {
    }
    public requiredDateHandle(): InputHandleRequired {
        return InputHandleRequired.none;
    }
    public hasResult() {
        return true;
    }
    public isHierarchic() {
        return false;
    }
}
export class DateRangeFillinValueMatch implements IExactValueMatch {
    //public type: "DateRangeFillinValueMatch" = "DateRangeFillinValueMatch"
    constructor(private dateSearchable: DateSearchable) {
    }
    public requiredDateHandle(): InputHandleRequired {
        return InputHandleRequired.dateRange;
    }
    public hasResult() {
        return true;
    }
    public onFillIn(range: IDateRange) {
        return this.dateSearchable.fillInRange(range);
    }
    public onFillInDateList(dates: Date[]) {
        return this.onFillIn(new SimpleDateRange(dates[0], dates[1]));
    }
    public isHierarchic() {
        return false;
    }
}
export class DateFillinValueMatch implements IExactValueMatch {
    public hasResult() {
        return true;
    }

    public requiredDateHandle(): InputHandleRequired {
        return InputHandleRequired.dateSingle;
    }

    //public type: "DateFillinValueMatch" = "DateFillinValueMatch"
    constructor(private dateSearchable: DateSearchable, private fillInType: IDateFillInType) {
    }
    public onFillIn(date: Date) {
        const range = this.fillInType.fillInDate(date);
        return this.dateSearchable.fillInRange(range);
    }
    public onFillInDateList(dates: Date[]) {
        return this.onFillIn(dates[0]);
    }
    public isHierarchic() {
        return false;
    }
}
export class NoResultValueMatch implements IExactValueMatch {
    public requiredDateHandle(): InputHandleRequired {
        return InputHandleRequired.none;
    }
    public hasResult() {
        return false;
    }
    public isHierarchic() {
        return false;
    }
}
export class HierarchicQueryValueMatch implements IExactValueMatch {
    constructor(public type: "and" | "or", public hierarchyInfo: HierachyInformation) {
    }
    public requiredDateHandle(): InputHandleRequired {
        return InputHandleRequired.hierarchicSelection;
    }
    public hasResult() {
        return true;
    }
    public isHierarchic() {
        return true;
    }
}

export interface IAutocompleteSuggestion {
    DisplayKey(): string;
    DisplayValue(): string;
    HoverText(): string;
    FillInKeyIfSelected(): string;
    FillInValueIfSelected(): string;
}

export class SimpleAutoCompleteListElement {
    constructor(private key: string, private value: string, private hovertext: string) {

    }
    public DisplayKey() {
        return this.key;
    }
    public DisplayValue() {
        return this.value;
    }
    public HoverText() {
        return this.hovertext;
    }
    public FillInKeyIfSelected() {
        return this.key;
    }
    public FillInValueIfSelected() {
        return this.value;
    }
}
