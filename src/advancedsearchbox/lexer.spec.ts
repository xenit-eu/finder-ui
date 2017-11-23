import { lex, lexUntil, Token, TokenType } from "./lexer";

describe("Advanced searchbox lexer", () => {
    it("should lex an expression to tokens", () => {
        let tokens = lex("creator = admin AND ( modifier = admin OR modified before 2017-01-15 )");

        expect(tokens).toEqual([
            new Token(TokenType.FIELD, "creator"),
            new Token(TokenType.WHITESPACE, " "),
            new Token(TokenType.OPERATOR, "="),
            new Token(TokenType.WHITESPACE, " "),
            new Token(TokenType.VALUE, "admin"),
            new Token(TokenType.WHITESPACE, " "),
            new Token(TokenType.CONDITION, "AND"),
            new Token(TokenType.WHITESPACE, " "),
            new Token(TokenType.BRACKET_OPEN, "("),
            new Token(TokenType.WHITESPACE, " "),
            new Token(TokenType.FIELD, "modifier"),
            new Token(TokenType.WHITESPACE, " "),
            new Token(TokenType.OPERATOR, "="),
            new Token(TokenType.WHITESPACE, " "),
            new Token(TokenType.VALUE, "admin"),
            new Token(TokenType.WHITESPACE, " "),
            new Token(TokenType.CONDITION, "OR"),
            new Token(TokenType.WHITESPACE, " "),
            new Token(TokenType.FIELD, "modified"),
            new Token(TokenType.WHITESPACE, " "),
            new Token(TokenType.OPERATOR, "before"),
            new Token(TokenType.WHITESPACE, " "),
            new Token(TokenType.VALUE, "2017-01-15"),
            new Token(TokenType.WHITESPACE, " "),
            new Token(TokenType.BRACKET_CLOSE, ")"),
        ]);
    });

    it("should lex an expression until a certain position to tokens", () => {
        let tokens = lexUntil("creator = admin AND ( modifier = admin OR modified before 2017-01-15 )", 15);

        expect(tokens).toEqual([
            new Token(TokenType.FIELD, "creator"),
            new Token(TokenType.WHITESPACE, " "),
            new Token(TokenType.OPERATOR, "="),
            new Token(TokenType.WHITESPACE, " "),
            new Token(TokenType.VALUE, "admin"),
        ]);

        tokens = lexUntil("creator = admin AND ( modifier = admin OR modified before 2017-01-15 )", 16);

        expect(tokens).toEqual([
            new Token(TokenType.FIELD, "creator"),
            new Token(TokenType.WHITESPACE, " "),
            new Token(TokenType.OPERATOR, "="),
            new Token(TokenType.WHITESPACE, " "),
            new Token(TokenType.VALUE, "admin"),
            new Token(TokenType.WHITESPACE, " "),
        ]);

    });
});
