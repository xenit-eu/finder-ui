
/*
type All_t = {all: string};
enum DateKeyword_t { TODAY, LASTWEEK, LASTMONTH, LASTYEAR  }
type Property_t = { property: { name: string, value: string } } |
                    { property: { name: string, range: {start: string, end: string}}} |
                    { property: { name: string, dateKeyword: DateKeyword_t}} |
                    { property: { name: string, list: string[] } }
type FinderQuery_t = { or: FinderQuery_t[] } | { and: FinderQuery_t[] } | {not: FinderQuery_t} | Property_t | All_t;
*/

// This is a fake type. The document type is mapped to this QName to be able to put all document information in a hashmap.
export const TYPE_QNAME = "{http://www.alfresco.org/model/content/1.0}type";

export type ApixQuery_t = any; // raw apix query. IE: {and: [{property: {name: "a", value: "b"}}]}
export type SearchTerm_t = { name: string, value: string };
export type Query_t = { label: string, query: ApixQuery_t };

function clone (obj: any): any {
    return JSON.parse(JSON.stringify(obj));
}

function traverseAndReplace (o: any, func: (k: string, v: any) => any) {
    Object.getOwnPropertyNames(o).forEach((i: string) => {
        const result = func.apply(this, [i, o[i]]);
        if (result) {
            o[i] = result;
        } else {
            if (o[i] !== null && typeof(o[i]) === "object") {
                //going one step down in the object tree!!
                traverseAndReplace(o[i], func);
            }
        }
    });
}

export function usersQueries (queries?: Query_t[]): Query_t[] {
    if (queries) {
        localStorage.setItem("users-queries", JSON.stringify(queries));
    }
    return JSON.parse(localStorage.getItem("users-queries") || "[]");
}

/**
 * For term value containing ".." => make a range search.
 *
 * @param term
 */
function apixSearchProperty (term: SearchTerm_t): {[k: string]: any} {
    const match = /\s*(.+)\.\.(.+)\s*/.exec(term.value);
    if (match) {
        return {name: term.name, range: {start: match[1], end: match[2]}};
    } else {
        return {name: term.name, value: term.value.trim()};
    }
}

export class FinderQuery {

    private rawQuery: ApixQuery_t;

    constructor (query: ApixQuery_t) {
        this.rawQuery = query;
    }

    /**
     *  convert search terms to apix query.
     *
     * @param searchTerms
     */
    public static fromSearchTerms (searchTerms: SearchTerm_t[], def: ApixQuery_t|null = { all: "**" }): FinderQuery {
        let result: ApixQuery_t = def;  // default: all
        if (searchTerms.length) {
            result = {and: []};

            let orChunks: {[k: string]: Array<{parent: string}|{type: string}|{text: string}|{property: {[k: string]: any}}>} = {};

            searchTerms.forEach(t => {
                if (!orChunks[t.name]) {
                    orChunks[t.name] = [];
                }
                switch (t.name) {
                    case "parent":
                        // specific term specifying the "parent" constraint.
                        orChunks[t.name].push({ parent: t.value });
                        break;
                    case "TEXT":
                        orChunks[t.name].push({ text: t.value });
                        break;
                    case TYPE_QNAME:
                        // Specific term specifying document type constraint
                        orChunks[t.name].push({type: t.value});
                        break;
                    default:
                        orChunks[t.name].push({ property: apixSearchProperty(t) });
                        break;
                }
            });

            for (let key in orChunks) {
                if (orChunks.hasOwnProperty(key)) {
                    switch (orChunks[key].length) {
                        case 0:
                            break;
                        case 1:
                            result.and.push(orChunks[key][0]);
                            break;
                        default:
                            result.and.push({ or: orChunks[key] });

                    }
                }
            }
        }
        return new FinderQuery(result);
    }

    public static fromCombinedTermsAndQueries (terms: SearchTerm_t[], queries: Query_t[]): FinderQuery {
        let q1: ApixQuery_t|null = null;
        let q2: ApixQuery_t|null = null;

        if (queries.length > 0) {
            q2 = clone(queries.length > 1 ? {and: queries.map(q => q.query)} : queries[0].query);
            // clone to avoid changing values in original queries.
        }

        // replace terms value inside queries when name of properties match.
        let usedTerms: string[] = [];
        traverseAndReplace(q2 || {}, (name: string, obj: any) => {
            if (name === "property") {
                const term = terms.filter((t: SearchTerm_t) => t.name === obj.name)[0];
                if (term) {
                    usedTerms.push(term.name);
                    return apixSearchProperty(term);
                }
            }
            return null;
        });

        const remainingTerms: SearchTerm_t[] = terms.filter(t => usedTerms.indexOf(t.name) === -1);
        q1 = FinderQuery.fromSearchTerms(remainingTerms, null).query;

        const result = (!!q1 && !!q2 ? {and: [q1, q2]} : (q1 || q2)) || {all: "**"};
        return new FinderQuery(result);
    }

    private static toApix(term: any): any {
        let value = term.value;

        switch (term.operator) {
            case "=":
                return { name: term.category, value };

            case "contains":
                value = "*" + value + "*";
                return { name: term.category, value };

            case ">=":
                return { name: term.category, range: {start: value, end: "MAX"} };

            case "<=":
                return { name: term.category, range: {start: "MIN", end: value} };

            default:
                return { name: term.category, value };
        }
    }

    /**
     *  Converts a ReactFilterBox query (advanced query) to an apix query.
     *
     * @param query
     */
    public static fromAdvancedQuery(query: any): FinderQuery {
        if (query.length === 0) {
            return new FinderQuery({ all: "**" });
        }
        let result: any = {};
        query.forEach((part: any) => {
            if (part.conditionType) {
                if (part.conditionType.toUpperCase() === "AND") {
                    if (!result.and) {
                        if (result.or) {
                            result = {and: [{ or: result.or }]};
                        } else {
                            result = {and: [result]};
                        }
                    }
                    if (part.expressions) {
                        result.and.push(FinderQuery.fromAdvancedQuery(part.expressions).rawQuery);
                    } else {
                        result.and.push({ property: FinderQuery.toApix(part) });
                    }
                }
                if (part.conditionType.toUpperCase() === "OR") {
                    if (!result.or) {
                        if (result.and) {
                            result = {or: [{ and: result.and }]};
                        } else {
                            result = {or: [result]};
                        }
                    }
                    if (part.expressions) {
                        result.or.push(FinderQuery.fromAdvancedQuery(part.expressions).rawQuery);
                    } else {
                        result.or.push({ property: FinderQuery.toApix(part) });
                    }

                }
            } else if (part.expressions) {
                result = FinderQuery.fromAdvancedQuery(part.expressions).rawQuery;
            } else {
                result = {property: FinderQuery.toApix(part)};
            }
        });
        return new FinderQuery(result);
    }

    get query (): ApixQuery_t {
        return this.rawQuery;
    }

    /**
     * recursive function !
     *
     * @param query
     */
    private static toHumanReadable(query: ApixQuery_t): string {
        const name = Object.getOwnPropertyNames(query)[0];
        switch (name) {
            case "and":
            case "or":
                return query[name].map((q: ApixQuery_t) => "(" + FinderQuery.toHumanReadable(q) + ")").join(` ${name.toUpperCase()} `);
            case "property":
                const prop = query[name];
                return prop.name.replace(/\{[^\{}]+\}/, "") + " = " + (prop.range ? prop.range.start + ".." + prop.range.end : prop.value);
            case "all":
                return "ALL";
            default:
                return "!bad: " + name;
        }
    }

    public toHumanReadableString (): string {
        return FinderQuery.toHumanReadable(this.query);
    }

}
