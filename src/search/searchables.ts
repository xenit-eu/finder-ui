import {
    DATE_FROM, DATE_LASTMONTH, DATE_LASTWEEK, DATE_LASTYEAR, DATE_ON, DATE_TODAY, DATE_UNTIL,
    FromDateRange, IDateRange, IDateRangeTranslator, LAST_MONTH_RANGE, LAST_WEEK_RANGE, LAST_YEAR_RANGE,
    SimpleDateRange, TODAY_RANGE, UntilDateRange,
} from "./DateRange";
import {
    AllSimpleSearchQueryElement, DatePropertySearchQueryElement, EnumPropertySearchQueryElement, FolderSearchQueryElement,
    ISearchQuery, ISimpleSearchQueryElement,
    PropertyNameService_t, ReferenceSimpleSearchQueryElement, TextSearchQueryElement, TranslationService_t,
} from "./searchquery";

export interface ISimpleSearchableQueryElement {
    MatchKeyValue(key: string, value: string): Promise<ExactValueMatch_t>;
    getPartiallyMatchingAutocompleteListElements(key: string, value: string): Promise<IAutocompleteListElement[]>;
}

const reNameValue: RegExp = /^([^\:]+)\:\s*(.+)\s*$/;
const reNoNameJustValue: RegExp = /[^\:]/;
const reQuery: RegExp = /\[([\w\s\-\_]+)\]/;
function ExistsFilter<T>(elements: (T | undefined | null | void)[]) {
    return <T[]>elements.filter(element => element);
}
function trimLowercase(s: string) {
    return s.trim().toLowerCase();
}
function lowercaseTrimContains(full: string, part: string) {
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
function lowercaseTrimEquals(a: string, b: string) {
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
    const onlyValueMatches = empty(key) && lowercaseTrimContains(container, value);
    const onlyKeyMatches = empty(value) && lowercaseTrimContains(container, key);
    return onlyKeyMatches || onlyKeyMatches;
}
export class ReferenceSearchableQueryElement implements ISimpleSearchableQueryElement {
    public constructor(public name: string, public wrappedQuery: ISearchQuery) {
    }

    private createAutocompleteListElement(): IAutocompleteListElement {
        return new SimpleAutoCompleteListElement("", this.name, this.name);
    }

    public getPartiallyMatchingAutocompleteListElements(key: string, value: string): Promise<IAutocompleteListElement[]> {
        return Promise.resolve(ContainsOrKeyOrValueOtherEmpty(key, value, this.name) ? [this.createAutocompleteListElement()] : []);
    }

    public MatchKeyValue(key: string, value: string): Promise<SimpleSearchQueryElementValueMatch | NoResultValueMatch> {
        const matches = empty(key) && lowercaseTrimEquals(value, this.name);
        return Promise.resolve(matches ?
            new SimpleSearchQueryElementValueMatch(new ReferenceSimpleSearchQueryElement(this.wrappedQuery, this.name)) : new NoResultValueMatch());
    }
}

export class AllSearchable implements ISimpleSearchableQueryElement {
    constructor(private translationService: TranslationService_t) {
    }

    public MatchKeyValue(key: string, value: string): Promise<ExactValueMatch_t> {
        return this.translationService("All").then(translatedAll => lowercaseTrimEquals(translatedAll, key) || lowercaseTrimEquals("", key) ?
            new SimpleSearchQueryElementValueMatch(new AllSimpleSearchQueryElement(this.translationService, value)) : new NoResultValueMatch());
    }
    public getPartiallyMatchingAutocompleteListElements(key: string, value: string): Promise<IAutocompleteListElement[]> {
        return this.translationService("All").then(translatedAll => lowercaseTrimContains(translatedAll, key) || lowercaseTrimContains("", key) ?
            [new SimpleAutoCompleteListElement(translatedAll, value, translatedAll + ":" + value)] : []);
    }
}

export abstract class PropertySearchable implements ISimpleSearchableQueryElement {
    constructor(public qname: string, protected propertyNameService: PropertyNameService_t) {
    }
    public MatchKeyValue(key: string, value: string): Promise<ExactValueMatch_t> {
        return this.propertyNameService.translatePropertyKey(this.qname).then(tQName => {
            return lowercaseTrimEquals(key, tQName) ? this.matchesValueExact(value) : new NoResultValueMatch();
        });
    }
    public abstract getPartiallyMatchingAutocompleteListElements(key: string, value: string): Promise<IAutocompleteListElement[]>;

    protected abstract matchesValueExact(value: string): Promise<ExactValueMatch_t>;
}
export type EnumPropertySearchableValue_t = string;
export class EnumPropertySearchable extends PropertySearchable {
    constructor(prop: string, private values: EnumPropertySearchableValue_t[], propertyNameService: PropertyNameService_t) {
        super(prop, propertyNameService);
    }

    protected matchesValueExact(val: string) {
        const match: EnumPropertySearchableValue_t | undefined = this.values.filter(v => lowercaseTrimEquals(v, val))[0]; //TODO INCORRECT => no translations used.
        const unfilteredP = Promise.all(this.values.map(v => {
            return this.propertyNameService.translatePropertyValue(this.qname, v).then(tValue =>
                lowercaseTrimEquals(tValue, val) ? new SimpleSearchQueryElementValueMatch(new EnumPropertySearchQueryElement(this.qname, v, this.propertyNameService)) : undefined);
        }));

        return unfilteredP.then(unfiltered => {
            const filtered = ExistsFilter(unfiltered);
            return filtered.length > 0 ? filtered[0] : new NoResultValueMatch();
        });
    }
    public getPartiallyMatchingAutocompleteListElements(key: string, value: string): Promise<IAutocompleteListElement[]> {
        return this.propertyNameService.translatePropertyKey(this.qname).then(tQName => {
            if (!lowercaseTrimContains(tQName, key)) {
                return Promise.resolve(<IAutocompleteListElement[]>[]);
            }
            const unfilteredP = Promise.all(this.values.map(v => {
                return this.propertyNameService.translatePropertyValue(this.qname, v).then(tValue =>
                    lowercaseTrimContains(tValue, value) ? new SimpleAutoCompleteListElement(tQName, tValue, tQName + ":" + tValue) : undefined);
            }));
            return <Promise<SimpleAutoCompleteListElement[]>>unfilteredP.then(uf => ExistsFilter<SimpleAutoCompleteListElement>(uf));
        });
    }
}

export class TextSearchable implements ISimpleSearchableQueryElement {
    constructor(private text: string, private translationService: TranslationService_t) {
    }
    public getPartiallyMatchingAutocompleteListElements(key: string, value: string): Promise<IAutocompleteListElement[]> {
        return this.translationService("text").then(textTranslated => {
            if (!lowercaseTrimContains(textTranslated, key)) {
                return <IAutocompleteListElement[]>[];
            }
            return lowercaseTrimContains(this.text, value) ?
                [new SimpleAutoCompleteListElement(textTranslated, this.text, textTranslated + ":" + this.text)] : [];
        });
    }
    public MatchKeyValue(key: string, value: string): Promise<ExactValueMatch_t> {
        return this.translationService("text").then(textTranslated => lowercaseTrimEquals(key, textTranslated) && lowercaseTrimEquals(value, this.text) ?
            new SimpleSearchQueryElementValueMatch(new TextSearchQueryElement(this.text, this.translationService)) : new NoResultValueMatch());
    }
}

export class FolderSearchable implements ISimpleSearchableQueryElement {

    constructor(public qnamePath: string, public displayPath: string, private translationService: TranslationService_t) {
    }

    public MatchKeyValue(key: string, value: string): Promise<ExactValueMatch_t> {
        return this.translationService("Folder").then(folderTranslated => lowercaseTrimEquals(this.displayPath, value) && lowercaseTrimEquals(key, folderTranslated) ?
            new SimpleSearchQueryElementValueMatch(new FolderSearchQueryElement(this.qnamePath, this.displayPath, this.translationService)) :
            new NoResultValueMatch());
    }

    public getPartiallyMatchingAutocompleteListElements(key: string, value: string): Promise<IAutocompleteListElement[]> {
        return this.translationService("Folder").then(folderTranslated => lowercaseTrimContains(folderTranslated, key) && lowercaseTrimContains(this.displayPath, value) ?
            [new SimpleAutoCompleteListElement(folderTranslated, this.displayPath, folderTranslated + ":" + this.displayPath)] : []);
    }
}

export interface IDateFillInType {
    fillInDate(date: Date): IDateRange;
}
export const DateFillInOn: IDateFillInType = {
    fillInDate: (date: Date) => new SimpleDateRange(date, date),
};
export const DateFillInAfter: IDateFillInType = {
    fillInDate: (date: Date) => new FromDateRange(date),
};
export const DateFillInBefore: IDateFillInType = {
    fillInDate: (date: Date) => new UntilDateRange(date),
};

export const DateFillInTypes: IDateFillInType[] = [DateFillInOn, DateFillInAfter, DateFillInBefore];
const DateFillInsearchables = [DATE_ON, DATE_FROM, DATE_UNTIL];
const DateRangeSearchables = [TODAY_RANGE, LAST_WEEK_RANGE, LAST_MONTH_RANGE, LAST_YEAR_RANGE];
export const DateSearchableWords = DateRangeSearchables.map(dRS => dRS.label).concat(DateFillInsearchables);
export class DateSearchable extends PropertySearchable {
    constructor(qname: string, propertyNameService: PropertyNameService_t, private dateRangeTranslator: IDateRangeTranslator) {
        super(qname, propertyNameService);
    }
    private dateWordToAutocompletion(translatedDateWord: string, translatedKey: string) {//TODO More complex check accounting typed date (e.g. typing "on 12/" should be aware of 12th day)
        return new SimpleAutoCompleteListElement(translatedKey, translatedDateWord, translatedKey + ":" + translatedDateWord);
    }
    private dateWordToMatch(dateWord: string): ExactValueMatch_t {//TODO More complex check accounting typed date (e.g. typing "on 12/" should be aware of 12th day)
        for (let dateRange of DateRangeSearchables) {
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
            default:
                return new NoResultValueMatch();
        }
    }

    private textToAutocompletion = {};
    public getPartiallyMatchingAutocompleteListElements(key: string, value: string): Promise<IAutocompleteListElement[]> {
        return this.propertyNameService.translatePropertyKey(this.qname).then(keyTrans => {
            if (!lowercaseTrimContains(keyTrans, key)) {
                return [];
            }
            return Promise.all(DateSearchableWords.map(dateWord => this.dateRangeTranslator.translateWord(dateWord)))
                .then(translatedDateValues => ExistsFilter<IAutocompleteListElement>(translatedDateValues.map((translatedDateValue, i) =>
                    (lowercaseTrimContains(translatedDateValue, value)) ? this.dateWordToAutocompletion(translatedDateValue, keyTrans) : undefined)));
        });
    }

    protected matchesValueExact(value: string): Promise<ExactValueMatch_t> {
        return Promise.all(DateSearchableWords.map(dateWord => this.dateRangeTranslator.translateWord(dateWord)))
            .then(translatedDateValues => ExistsFilter<ExactValueMatch_t>(translatedDateValues.map((translatedDateValue, i) =>
                (lowercaseTrimEquals(translatedDateValue, value)) ? this.dateWordToMatch(DateSearchableWords[i]) : undefined)))
            .then(validMatches => validMatches.length > 0 ? validMatches[0] : new NoResultValueMatch());
    }

    public fillInRange(dRange: IDateRange): DatePropertySearchQueryElement {
        return new DatePropertySearchQueryElement(this.qname, dRange, this.dateRangeTranslator, this.propertyNameService);

    }
}
export type ExactValueMatch_t =
    SimpleSearchQueryElementValueMatch |
    DateRangeFillinValueMatch |
    DateFillinValueMatch |
    NoResultValueMatch;

export class SimpleSearchQueryElementValueMatch {
    public type: "SimpleSearchQueryElementValueMatch" = "SimpleSearchQueryElementValueMatch";
    constructor(public simpleSearchQueryElement: ISimpleSearchQueryElement) {
    }
}
export class DateRangeFillinValueMatch {
    public type: "DateRangeFillinValueMatch" = "DateRangeFillinValueMatch";
    constructor(private dateSearchable: DateSearchable) {
    }

    public onFillIn(range: IDateRange) {
        return this.dateSearchable.fillInRange(range);
    }
    public onFillInDateList(dates: Date[]) {
        return this.onFillIn(new SimpleDateRange(dates[0], dates[1]));
    }
}
export class DateFillinValueMatch {
    public type: "DateFillinValueMatch" = "DateFillinValueMatch";
    constructor(private dateSearchable: DateSearchable, private fillInType: IDateFillInType) {
    }
    public onFillIn(date: Date) {
        const range = this.fillInType.fillInDate(date);
        return this.dateSearchable.fillInRange(range);
    }
    public onFillInDateList(dates: Date[]) {
        return this.onFillIn(dates[0]);
    }
}
export class NoResultValueMatch {
    public type: "NoResultValueMatch" = "NoResultValueMatch";

}

export interface IAutocompleteListElement {
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
