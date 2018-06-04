import * as moment from "moment";

export const DATE_ON = "on";
export const DATE_FROM = "from";
export const DATE_UNTIL = "until";
export const DATE_TODAY = "today";
export const DATE_LASTWEEK = "last week";
export const DATE_LASTMONTH = "last month";
export const DATE_LASTYEAR = "last year";

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
}
export class SimpleDateRange implements IDateRange {
    private arrow = "\u2192";
    public constructor(private from: Date, private to: Date) {
    }
    public ToHumanReadableString(translator: IDateRangeTranslator) {
        return (translator.translateDate(this.from) + " " + this.arrow + " " + translator.translateDate(this.to));
    }
    public From() {
        return this.from;
    }
    public To() {
        return this.to;
    }
}
const DAYINMS: number = 24 * 3600 * 1000;
export function addMonths(d: Date, months: number): Date {
    let result = new Date(d.valueOf());
    /*Overflow OK => https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setMonth*/
    result.setMonth(result.getMonth() + months);
    return result;
}

export function addDays(d: Date, days: number): Date {
    return new Date(d.getTime() + (days * this.DAYINMS));
}

export class UntilDateRange implements IDateRange {
    constructor(public to: Date) {

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
}
export class FromDateRange implements IDateRange {
    constructor(public from: Date) {

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
}
export type DateCalculation_t = (date: Date) => Date;

export class LabeledDateRange implements IDateRange {
    constructor(public label: string, public fromCalculation: DateCalculation_t, public toCalculation: DateCalculation_t) {
    }
    public From() {
        return this.fromCalculation(new Date());
    }
    public To() {
        return this.toCalculation(new Date());
    }
    public ToHumanReadableString(translator: IDateRangeTranslator): string {
        return translator.translateWord(this.label);
    }
}

export const TODAY_RANGE = new LabeledDateRange(DATE_TODAY, (d) => d, (d) => d);
export const LAST_WEEK_RANGE = new LabeledDateRange(DATE_LASTWEEK, (d) => addDays(d, -7), (d) => d);
export const LAST_MONTH_RANGE = new LabeledDateRange(DATE_LASTMONTH, (d) => addMonths(d, -1), (d) => d);
export const LAST_YEAR_RANGE = new LabeledDateRange(DATE_LASTYEAR, (d) => addMonths(d, -12), (d) => d);
