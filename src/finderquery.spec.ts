
import { FinderQuery } from "./finderquery";

describe("advanced query to apix query ", () => {

    xit("in combination with one expression corresponding to braces", () => {

        const input = [
            { category: "title", operator: "contains", value: "hi" },
            {
                expressions: [{ category: "author", operator: "=", value: "hello" },
                              { category: "size", operator: "=", value: "1000", conditionType: "OR" }],
                conditionType: "AND",
            },
        ];

        const expected = {
            and: [
                { property: { name: "title", value: "*hi*" } },
                {
                    or: [
                        { property: { name: "author", value: "hello" } },
                        { property: { name: "size", value: "1000" } },
                    ],
                },
            ],
        };

        expect(FinderQuery.fromAdvancedQuery(input).query).toEqual(expected);
    });

    it('3 parts with combination of "and" and "or"', () => {

        const input = [{ category: "title", operator: "=", value: "hi" },
        { category: "author", operator: "=", value: "hello", conditionType: "AND" },
        { category: "size", operator: "=", value: "1000", conditionType: "OR" }];

        const expected = {
            or: [
                {
                    and: [
                        { property: { name: "title", value: "hi" } },
                        { property: { name: "author", value: "hello" } },
                    ],
                },
                { property: { name: "size", value: "1000" } },
            ],
        };

        expect(FinderQuery.fromAdvancedQuery(input).query).toEqual(expected);
    });

    it("3 parts with AND", () => {

        const input = [{ category: "title", operator: "=", value: "hi" },
        { category: "author", operator: "=", value: "hello", conditionType: "AND" },
        { category: "size", operator: "=", value: "1000", conditionType: "AND" }];

        const expected = {
            and: [
                { property: { name: "title", value: "hi" } },
                { property: { name: "author", value: "hello" } },
                { property: { name: "size", value: "1000" } },
            ],
        };

        expect(FinderQuery.fromAdvancedQuery(input).query).toEqual(expected);
    });

    it("2 parts with or", () => {

        const input = [{ category: "title", operator: "=", value: "hi" },
        { category: "author", operator: "=", value: "hello", conditionType: "OR" }];

        const expected = {
            or: [
                { property: { name: "title", value: "hi" } },
                { property: { name: "author", value: "hello" } },
            ],

        };

        expect(FinderQuery.fromAdvancedQuery(input).query).toEqual(expected);
    });

    it("2 parts with and", () => {
        const input = [{ category: "title", operator: "=", value: "hi" },
        { category: "author", operator: "=", value: "hello", conditionType: "AND" }];
        const expected = {
            and: [
                { property: { name: "title", value: "hi" } },
                { property: { name: "author", value: "hello" } },
            ],
        };
        expect(FinderQuery.fromAdvancedQuery(input).query).toEqual(expected);
    });

    it("single criteria", () => {
        const input = [{ category: "author", operator: "=", value: "hello" }];
        const expected = { property: { name: "author", value: "hello" } };

        expect(FinderQuery.fromAdvancedQuery(input).query).toEqual(expected);
    });

    it("less than", () => {
        const input = [{ category: "date", operator: "<=", value: "2017-01-02" }];
        const expected = { property: { name: "date", range: {start: "MIN", end: "2017-01-02" } }};

        expect(FinderQuery.fromAdvancedQuery(input).query).toEqual(expected);
    });

    it("greater than", () => {
        const input = [{ category: "date", operator: ">=", value: "2017-01-02" }];
        const expected = { property: { name: "date", range: {start: "2017-01-02", end: "MAX" } }};

        expect(FinderQuery.fromAdvancedQuery(input).query).toEqual(expected);
    });


});
