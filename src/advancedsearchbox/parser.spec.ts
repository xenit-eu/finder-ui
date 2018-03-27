import { lex, TokenType } from "./lexer";
import parse from "./parser";

describe("Advanced searchbox AST", () => {
    it("should convert a simple expression to an AST", () => {
        let tokens = lex("creator = admin");

        let tree = parse(tokens);

        expect(tree).not.toBeNull();

        expect(tree && tree.toJSON()).toEqual({
            property: {
                field: "creator",
                operator: "=",
                value: "admin",
            },
        });
    });

    it("should convert an expression to an AST", () => {
        let tokens = lex("creator = admin AND modifier = admin");

        let tree = parse(tokens);
        expect(tree).not.toBeNull();

        expect(tree && tree.toJSON()).toEqual({
            and: [
                {
                    property: {
                        field: "creator",
                        operator: "=",
                        value: "admin",
                    },
                },
                {
                    property: {
                        field: "modifier",
                        operator: "=",
                        value: "admin",
                    },
                },
            ],
        });
    });

    it("should convert a complex expression with brackets to an AST", () => {
        let tokens = lex("creator = admin AND (modifier = admin OR modified before 2017-01-01)");

        let tree = parse(tokens);
        expect(tree).not.toBeNull();

        expect(tree && tree.toJSON()).toEqual({
            and: [
                {
                    property: {
                        field: "creator",
                        operator: "=",
                        value: "admin",
                    },
                },
                {
                    or: [
                        {
                            property: {
                                field: "modifier",
                                operator: "=",
                                value: "admin",
                            },
                        },
                        {
                            property: {
                                field: "modified",
                                operator: "before",
                                value: "2017-01-01",
                            },
                        },
                    ],
                },
            ],
        });
    });

    it("should flatten multiple conditions of the same type", () => {
        let tokens = lex("creator = admin AND modifier = admin AND modified before 2017-01-01");

        let tree = parse(tokens);
        expect(tree).not.toBeNull();

        expect(tree && tree.toJSON()).toEqual({
            and: [
                {
                    property: {
                        field: "creator",
                        operator: "=",
                        value: "admin",
                    },
                },
                {
                    property: {
                        field: "modifier",
                        operator: "=",
                        value: "admin",
                    },
                },
                {
                    property: {
                        field: "modified",
                        operator: "before",
                        value: "2017-01-01",
                    },
                },
            ],
        });
    });

    it("Should handle multiple open brackets after each other", () => {
        let tokens = lex("(( creator = admin AND modifier = admin ) OR modified before 2017-01-01 ) AND created on 2012-01-01");

        let tree = parse(tokens);
        expect(tree).not.toBeNull();

        expect(tree && tree.toJSON()).toEqual({
            and: [
                {
                    or: [
                        {
                            and: [
                                {
                                    property: {
                                        field: "creator",
                                        operator: "=",
                                        value: "admin",
                                    },
                                },
                                {
                                    property: {
                                        field: "modifier",
                                        operator: "=",
                                        value: "admin",
                                    },
                                },
                            ],
                        },
                        {
                            property: {
                                field: "modified",
                                operator: "before",
                                value: "2017-01-01",
                            },
                        },

                    ],
                },
                {
                    property: {
                        field: "created",
                        operator: "on",
                        value: "2012-01-01",
                    },
                },
            ],
        });
    });

    it("Should handle multiple closing brackets after each other", () => {
        let tokens = lex("( creator = admin OR ( modifier = admin AND modified before 2017-01-01 )) AND created on 2012-01-01");

        let tree = parse(tokens);
        expect(tree).not.toBeNull();

        expect(tree && tree.toJSON()).toEqual({
            and: [
                {
                    or: [
                        {
                            property: {
                                field: "creator",
                                operator: "=",
                                value: "admin",
                            },
                        },
                        {
                            and: [
                                {
                                    property: {
                                        field: "modifier",
                                        operator: "=",
                                        value: "admin",
                                    },
                                },
                                {
                                    property: {
                                        field: "modified",
                                        operator: "before",
                                        value: "2017-01-01",
                                    },
                                },

                            ],
                        },

                    ],
                },
                {
                    property: {
                        field: "created",
                        operator: "on",
                        value: "2012-01-01",
                    },
                },
            ],
        });
    });
});
