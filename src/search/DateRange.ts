import moment from "moment";

export const DATE_ON = "on...";
export const DATE_FROM = "from...";
export const DATE_UNTIL = "until...";
export const DATE_BETWEEN = "between...";

export const DATE_TODAY = "today";
export const DATE_LASTWEEK = "last week";
export const DATE_LASTMONTH = "last month";
export const DATE_LAST6MONTH = "last 6 months";
export const DATE_LASTYEAR = "last year";
export const DATE_RANGE_PICK = "pick a date range...";
export interface IDateRangeTranslator {
    translateDate(date: Date): string;
    translateWord(word: string): string;
}
export class MomentDateRangeTranslator implements IDateRangeTranslator {
    constructor(public translateWord: (word: string) => string) {

    }
    public translateDate(date: Date) {
        return moment(date).format("Y/M/D");
    }
}
export interface IDateRange {
    From(): "MIN" | Date;
    To(): "MAX" | Date;
    ToHumanReadableString(translator: IDateRangeTranslator): string;
    ToJSON(): object;
    TYPE: string;
    equals(other: IDateRange): boolean;
    visit<T>(visitor: IDateRangeVisitor<T>): T;
}
export function GetBeginOfDay(toBegin: Date) {
    const ret = new Date(toBegin.getTime());
    ret.setSeconds(0);
    ret.setMinutes(0);
    ret.setHours(0);
    ret.setMilliseconds(0);
    return ret;
}

export function GetEndOfDay(toEnd: Date) {
    const ret = new Date(toEnd.getTime());
    ret.setSeconds(59);
    ret.setMinutes(59);
    ret.setHours(23);
    ret.setMilliseconds(999);
    return ret;
}

export interface IDateRangeVisitor<T> {
    visitSimpleDateRange(simpleDateRange: SimpleDateRange): T;
    visitUntilDateRange(untilDateRange: UntilDateRange): T;
    visitFromDateRange(fromDateRange: FromDateRange): T;
    visitLabeledDateRange(labeledDateRange: LabeledDateRange): T;
}

export class SimpleDateRange implements IDateRange {
    private from: Date;
    private to: Date;

    public static readonly TYPE = "SimpleDateRange";
    public TYPE = SimpleDateRange.TYPE;
    public ToJSON() {
        return { TYPE: this.TYPE, from: JSON.stringify(this.from), to: JSON.stringify(this.to) };
    }
    public static ParseFromJSON(json: any) {
        return new SimpleDateRange(new Date(json.from), new Date(json.to));
    }
    public constructor(from: Date, to: Date) {
        this.from = GetBeginOfDay(from);
        this.to = GetEndOfDay(to);
    }
    public ToHumanReadableString(translator: IDateRangeTranslator) {
        const fromS = translator.translateDate(this.from);
        const toS = translator.translateDate(this.to);
        if (fromS === toS) {
            return fromS;
        }
        return (fromS + " " + "\u2192" + " " + toS);
    }
    public From() {
        return this.from;
    }
    public To() {
        return this.to;
    }
    public equals(other: IDateRange): boolean {
        return other instanceof SimpleDateRange && other.from.valueOf() === this.from.valueOf() && other.to.valueOf() === this.to.valueOf();
    }
    public visit<T>(visitor: IDateRangeVisitor<T>) {
        return visitor.visitSimpleDateRange(this);
    }
}
const DAYINMS: number = 24 * 3600 * 1000;
export function addMonths(d: Date, months: number): Date {
    const result = new Date(d.valueOf());
    /*Overflow OK => https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setMonth*/
    result.setMonth(result.getMonth() + months);
    return result;
}

export function addDays(d: Date, days: number): Date {
    const ret = new Date(d.getTime());
    ret.setDate(d.getDate() + days);
    return ret;
}
export class UntilDateRange implements IDateRange {
    public to: Date;

    public static readonly TYPE = "UntilDateRange";
    public TYPE = UntilDateRange.TYPE;
    public ToJSON() {
        return this;
    }
    public static ParseFromJSON(json: any) {
        return new UntilDateRange(new Date(json.to));
    }
    constructor(to: Date) {
        this.to = GetEndOfDay(to);
    }
    public From(): "MIN" {
        return "MIN";
    }
    public To() {
        return this.to;
    }
    public ToHumanReadableString(translator: IDateRangeTranslator): string {
        return translator.translateWord(DATE_FROM) + " " + translator.translateDate(this.to);
    }

    public equals(other: IDateRange): boolean {
        return other instanceof UntilDateRange && other.to.valueOf() === this.to.valueOf();
    }
    public visit<T>(visitor: IDateRangeVisitor<T>) {
        return visitor.visitUntilDateRange(this);
    }
}
export class FromDateRange implements IDateRange {
    public from: Date;
    public static readonly TYPE = "FromDateRange";
    public TYPE = FromDateRange.TYPE;
    public ToJSON() {
        return this;
    }
    public static ParseFromJSON(json: any) {
        return new UntilDateRange(new Date(json.from));
    }

    constructor(from: Date) {
        this.from = GetBeginOfDay(from);
    }
    public From() {
        return this.from;
    }
    public To(): "MAX" {
        return "MAX";
    }
    public ToHumanReadableString(translator: IDateRangeTranslator): string {
        return translator.translateWord(DATE_FROM) + " " + translator.translateDate(this.from);
    }
    public equals(other: IDateRange): boolean {
        return other instanceof FromDateRange && other.from.valueOf() === this.from.valueOf();
    }
    public visit<T>(visitor: IDateRangeVisitor<T>) {
        return visitor.visitFromDateRange(this);
    }
}
export type DateCalculation_t = (date: Date) => Date;

export class LabeledDateRange implements IDateRange {
    public static readonly TYPE = "LabeledDateRange";
    public TYPE = LabeledDateRange.TYPE;
    public ToJSON() {
        return this;
    }
    public static ParseFromJSON(json: any): IDateRange {
        const dateRanges = DateRangeSearchables;
        const ret = dateRanges.filter((e) => e.label === json.label)[0];
        if (!ret) {
            console.error("ret is null");
            console.error(json);
        }
        return ret;
    }
    constructor(public label: string, public fromCalculation: DateCalculation_t, public toCalculation: DateCalculation_t) {
    }
    public From() {
        return this.fromCalculation(GetBeginOfDay(new Date()));
    }
    public To() {
        return this.toCalculation(GetEndOfDay(new Date()));
    }
    public ToHumanReadableString(translator: IDateRangeTranslator): string {
        return translator.translateWord(this.label);
    }
    public equals(other: IDateRange): boolean {
        return other instanceof LabeledDateRange && this.label === other.label;
    }
    public visit<T>(visitor: IDateRangeVisitor<T>) {
        return visitor.visitLabeledDateRange(this);
    }
}

export const TODAY_RANGE = new LabeledDateRange(DATE_TODAY, (d) => addDays(d, -1), (d) => d);
export const LAST_WEEK_RANGE = new LabeledDateRange(DATE_LASTWEEK, (d) => addDays(d, -7), (d) => d);
export const LAST_MONTH_RANGE = new LabeledDateRange(DATE_LASTMONTH, (d) => addMonths(d, -1), (d) => d);
export const LAST_6_MONTHS_RANGE = new LabeledDateRange(DATE_LAST6MONTH, (d) => addMonths(d, -6), (d) => d);
export const LAST_YEAR_RANGE = new LabeledDateRange(DATE_LASTYEAR, (d) => addMonths(d, -12), (d) => d);
export const DateRangeSearchables = [TODAY_RANGE, LAST_WEEK_RANGE, LAST_MONTH_RANGE, LAST_6_MONTHS_RANGE, LAST_YEAR_RANGE];
function toParsable(TYPE: string, ParseFromJSON: (json: any) => IDateRange) {
    return { TYPE, ParseFromJSON };
}
const dateRangeParsables = [LabeledDateRange, FromDateRange, UntilDateRange, SimpleDateRange].map((t) => toParsable(t.TYPE, t.ParseFromJSON));
export function ParseDateRangeJSON(json: any) {
    for (const dateRangeParsable of dateRangeParsables) {
        if (dateRangeParsable.TYPE === json.TYPE) {
            return dateRangeParsable.ParseFromJSON(json);
        }
    }
    throw new Error("Type of daterange not parsable");

}
