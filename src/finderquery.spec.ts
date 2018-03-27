
import { FinderQuery, Query_t, SearchTerm_t, TYPE_QNAME } from "./finderquery";

import lex from "./advancedsearchbox/lexer";
import parse from "./advancedsearchbox/parser";

describe("search terms to apix query", () => {
    it("2 search terms", () => {
        const input: SearchTerm_t[] = [{
            name: "author",
            value: "admin",
        }, {
            name: "size",
            value: "123",
        }];

        const expected = {
            and: [{
                property: { name: "author", value: "admin" },
            }, {
                property: { name: "size", value: "123" },
            }],
        };

        expect(FinderQuery.fromSearchTerms(input).query).toEqual(expected);
    });

    it("with a type as search term", () => {
        const input: SearchTerm_t[] = [{
            name: TYPE_QNAME,
            value: "cm:content",
        }];

        const expected = {
            and: [{
                type: "cm:content",
            }],
        };
        expect(FinderQuery.fromSearchTerms(input).query).toEqual(expected);
    });

    it("with multiple identical search terms", () => {
        const input: SearchTerm_t[] = [{
            name: "author",
            value: "admin",
        }, {
            name: "author",
            value: "jos",

        }, {
            name: "size",
            value: "123",
        }];

        const expected = {
            and: [{
                or: [{
                    property: { name: "author", value: "admin" },
                }, {
                    property: { name: "author", value: "jos" },
                }],
            }, {
                property: { name: "size", value: "123" },
            }],
        };

        expect(FinderQuery.fromSearchTerms(input).query).toEqual(expected);
    });

    it("With multiple search terms and queries", () => {
        const terms: SearchTerm_t[] = [
            {
                name: "All",
                value: "abeecher",
            }, {
                name: "parent",
                value: "some://noderef/value",
            }, {
                name: "{http://www.alfresco.org/model/content/1.0}name",
                value: "avatar",
            },
        ];

        const queries: Query_t[] = [{
            label: "Some label",
            query: {
                or: [{
                    property: { name: "{http://www.alfresco.org/model/content/1.0}creator", value: "abeecher" },
                }, {
                    property: { name: "{http://www.alfresco.org/model/content/1.0}name", value: "abeecher" },
                }, {
                    property: { name: "{http://www.alfresco.org/model/content/1.0}title", value: "abeecher" },
                }],
            },
        }];

        const expected = {
            and: [{
                and: [{
                    property: {
                        name: "All",
                        value: "abeecher",
                    },
                }, {
                    parent: "some://noderef/value",
                }, {
                    property: {
                        name: "{http://www.alfresco.org/model/content/1.0}name",
                        value: "avatar",
                    },
                }],
            },

            queries[0].query,
        ],
    };

        expect(FinderQuery.fromCombinedTermsAndQueries(terms, queries));
    });

    it("Can reverse a simple apix query to search terms", () => {
        const apix = {
            property: {
                name: "abc",
                value: "*def*",
            },
        };

        const query = new FinderQuery(apix);

        const { terms, queries } = query.toSearchTermsAndQueries();

        expect(terms).toEqual([
            {
                name: "abc",
                value: "*def*",
            },
        ]);

        expect(queries.length).toEqual(0);
    });

    it("Can reverse an apix query to search terms and queries", () => {
        const apix = {
            and: [{
                and: [{
                    property: {
                        name: "All",
                        value: "abeecher",
                    },
                }, {
                    and: [{
                        parent: "some://noderef/value",
                    }],
                }, {
                    property: {
                        name: "{http://www.alfresco.org/model/content/1.0}name",
                        value: "avatar",
                    },
                }],
            }, {
                or: [{
                    and: [{
                        property: { name: "author", value: "admin" },
                    }, {
                        property: { name: "size", value: "123" },
                    }],
                }, {
                    property: { name: "author", value: "jos" },
                }],
            }],
        };

        const query = new FinderQuery(apix);

        const { terms, queries } = query.toSearchTermsAndQueries();

        expect(terms).toEqual([
            {
                name: "All",
                value: "abeecher",
            }, {
                name: "parent",
                value: "some://noderef/value",
            }, {
                name: "{http://www.alfresco.org/model/content/1.0}name",
                value: "avatar",
            },
        ]);

        expect(queries.length).toEqual(1);
        expect(queries[0].query).toEqual({
                or: [{
                    and: [{
                        property: { name: "author", value: "admin" },
                    }, {
                        property: { name: "size", value: "123" },
                    }],
                }, {
                    property: { name: "author", value: "jos" },
                }],
            });

    });
});

describe("advanced query to apix query ", () => {

    it("in combination with one expression corresponding to braces", () => {

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

        const input = [
            { category: "title", operator: "=", value: "hi" },
            { category: "author", operator: "=", value: "hello", conditionType: "AND" },
            { category: "size", operator: "=", value: "1000", conditionType: "AND" },
        ];

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
        const input = [{ category: "date", operator: "till", value: "2017-01-02" }];
        const expected = { property: { name: "date", range: { start: "MIN", end: "2017-01-02" } } };

        expect(FinderQuery.fromAdvancedQuery(input).query).toEqual(expected);
    });

    it("greater than", () => {
        const input = [{ category: "date", operator: "from", value: "2017-01-02" }];
        const expected = { property: { name: "date", range: { start: "2017-01-02", end: "MAX" } } };

        expect(FinderQuery.fromAdvancedQuery(input).query).toEqual(expected);
    });

    it("complex query: (name contains fred AND created <= 2017-08-01) OR name contains move2alf", () => {
        const input = [{
            expressions: [
                { category: "name", operator: "contains", value: "fred" },
                { category: "created", operator: "till", value: "2017-08-01", conditionType: "AND" },
            ],
        },
        { category: "name", operator: "contains", value: "move2alf", conditionType: "OR" }];

        const expected = {
            or: [
                {
                    and: [
                        { property: { name: "name", value: "*fred*" } },
                        { property: { name: "created", range: { start: "MIN", end: "2017-08-01" } } },
                    ],
                },
                { property: { name: "name", value: "*move2alf*" } },
            ],
        };

        expect(FinderQuery.fromAdvancedQuery(input).query).toEqual(expected);
    });

});

describe("AST to apix query", () => {
    it("2 search terms and", () => {
        const query = FinderQuery.fromAST(parse(lex("Name = abc AND title contains def")));

        expect(query.query).toEqual({
            and: [{
                property: {
                    name: "Name",
                    value: "abc",
                },
            }, {
                property: {
                    name: "title",
                    value: "*def*",
                },
            },
            ],
        });
    });

    it("2 search terms or", () => {
        const query = FinderQuery.fromAST(parse(lex("Name = abc OR title contains def")));
        expect(query.query).toEqual({
            or: [{
                property: {
                    name: "Name",
                    value: "abc",
                },
            }, {
                property: {
                    name: "title",
                    value: "*def*",
                },
            },
            ],
        });
    });

    it("3 search terms and", () => {
        const query = FinderQuery.fromAST(parse(lex("Name = abc AND title contains def AND created on 2012-01-01")));

        expect(query.query).toEqual({
            and: [{
                property: {
                    name: "Name",
                    value: "abc",
                },
            }, {
                property: {
                    name: "title",
                    value: "*def*",
                },
            }, {
                property: {
                    name: "created",
                    range: {
                        start: "2012-01-01",
                        end: "2012-01-01",
                    },
                },
            },
            ],
        });
    });

    it("3 search terms and and or", () => {
        const query = FinderQuery.fromAST(parse(lex("Name = abc AND title contains def OR created on 2012-01-01")));

        expect(query.query).toEqual({
            or: [{
                and: [{
                    property: {
                        name: "Name",
                        value: "abc",
                    },
                }, {
                    property: {
                        name: "title",
                        value: "*def*",
                    },
                }],
            }, {
                property: {
                    name: "created",
                    range: {
                        start: "2012-01-01",
                        end: "2012-01-01",
                    },
                },
            },
            ],
        });

        const query2 = FinderQuery.fromAST(parse(lex("Name = abc OR title contains def AND created on 2012-01-01")));

        expect(query2.query).toEqual({
            and: [{
                or: [{
                    property: {
                        name: "Name",
                        value: "abc",
                    },
                }, {
                    property: {
                        name: "title",
                        value: "*def*",
                    },
                }],
            }, {
                property: {
                    name: "created",
                    range: {
                        start: "2012-01-01",
                        end: "2012-01-01",
                    },
                },
            },
            ],
        });
    });

    it("3 search terms and and or in brackets", () => {

        const query = FinderQuery.fromAST(parse(lex("Name = abc OR (title contains def AND created on 2012-01-01)")));

        expect(query.query).toEqual({
            or: [
                {
                    property: {
                        name: "Name",
                        value: "abc",
                    },
                }, {
                    and: [{
                        property: {
                            name: "title",
                            value: "*def*",
                        },
                    }, {
                        property: {
                            name: "created",
                            range: {
                                start: "2012-01-01",
                                end: "2012-01-01",
                            },
                        },
                    }],
                },
            ],
        });
    });

    describe("Operator parsing", () => {
        it("=", () => {
            const query = FinderQuery.fromAST(parse(lex("Name = abc")));
            expect(query.query).toEqual({
                property: {
                    name: "Name",
                    value: "abc",
                },
            });
        });
        it("contains", () => {
            const query = FinderQuery.fromAST(parse(lex("Name contains abc")));
            expect(query.query).toEqual({
                property: {
                    name: "Name",
                    value: "*abc*",
                },
            });
        });
        it("on", () => {
            const query = FinderQuery.fromAST(parse(lex("created on 2012-01-01")));
            expect(query.query).toEqual({
                property: {
                    name: "created",
                    range: {
                        start: "2012-01-01",
                        end: "2012-01-01",
                    },
                },
            });
        });
        it("from", () => {
            const query = FinderQuery.fromAST(parse(lex("created from 2012-01-01")));
            expect(query.query).toEqual({
                property: {
                    name: "created",
                    range: {
                        start: "2012-01-01",
                        end: "MAX",
                    },
                },
            });
        });
        it("till", () => {
            const query = FinderQuery.fromAST(parse(lex("created till 2012-01-01")));
            expect(query.query).toEqual({
                property: {
                    name: "created",
                    range: {
                        start: "MIN",
                        end: "2012-01-01",
                    },
                },
            });
        });
    });

    it("Can reverse a simple apix query to AST", () => {
        const apix = {
            property: {
                name: "abc",
                value: "*def*",
            },
        };

        const query = new FinderQuery(apix);

        const ast = query.toAST();
        expect(ast).not.toBeNull();

        expect(ast!.toString()).toEqual("abc contains def");
    });

    it("Can reverse an apix query to AST", () => {
        const apix = {
            and: [{
                and: [{
                    property: {
                        name: "All",
                        value: "abeecher",
                    },
                }, {
                    and: [{
                        property: {
                            name: "xyz",
                            value: "abc",
                        },
                    }],
                }, {
                    property: {
                        name: "{http://www.alfresco.org/model/content/1.0}name",
                        value: "avatar",
                    },
                }],
            }, {
                or: [{
                    and: [{
                        property: { name: "author", value: "admin" },
                    }, {
                        property: { name: "size", value: "123" },
                    }],
                }, {
                    property: { name: "author", value: "jos" },
                }],
            }],
        };

        const query = new FinderQuery(apix);

        const ast = query.toAST();
        expect(ast).not.toBeNull();

        const result = parse(lex("( All = abeecher AND xyz = abc AND {http://www.alfresco.org/model/content/1.0}name = avatar ) AND ( ( author = admin AND size = 123 ) OR author = jos )"))!.toJSON();

        expect(ast!.toJSON()).toEqual(<any>result, JSON.stringify(ast!.toJSON()) +" != " + JSON.stringify(result));

    });
});
