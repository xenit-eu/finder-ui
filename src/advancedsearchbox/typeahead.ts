import { expectedNextType, lexUntil, Token, TokenType } from "./lexer";

export type AutocompleteValue_t = string | {
    render?: (element: HTMLLIElement, data: any, cur: any) => void;
};

export interface IAutocompleteProvider {
    needFields(value: string): Promise<AutocompleteValue_t[]>;

    needOperators(field: string, value: string): Promise<AutocompleteValue_t[]>;

    needValues(field: string, operator: string, value: string): Promise<AutocompleteValue_t[]>;
}

export default function getHints(autocomplete: IAutocompleteProvider, tokens: Token[]): Promise<AutocompleteValue_t[]> {
    let lastToken = tokens[tokens.length - 1];
    let isGuessed = lastToken.value === "";
    let realToken = !isGuessed ? lastToken : tokens.filter(t => t.type !== TokenType.WHITESPACE && t.value !== "").pop();
    let lastField = tokens.filter(t => t.type === TokenType.FIELD).pop();
    let lastOperator = tokens.filter(t => t.type === TokenType.OPERATOR).pop();

    let nextTokenTypes = expectedNextType(realToken);

    let bracketDepth = 0;

    tokens.filter(t => t.type === TokenType.BRACKET_CLOSE || t.type === TokenType.BRACKET_OPEN)
        .forEach(t => {
            if (t.type === TokenType.BRACKET_CLOSE) {
                bracketDepth = Math.max(0, bracketDepth + 1);
            } else {
                bracketDepth++;
            }
        });

    let valuePromise: Promise<AutocompleteValue_t[]> = Promise.resolve([]);
    switch (lastToken.type) {
        case TokenType.FIELD:
            valuePromise = autocomplete.needFields(lastToken.value);
            break;
        case TokenType.OPERATOR:
            if (lastField) {
                valuePromise = autocomplete.needOperators(lastField.value, lastToken.value);
            }
            break;
        case TokenType.VALUE:
            if (lastField && lastOperator) {
                valuePromise = autocomplete.needValues(lastField.value, lastOperator.value, lastToken.value);
            }
            break;
        case TokenType.CONDITION:
            valuePromise = Promise.resolve(["AND", "OR"]);
            break;
        case TokenType.BRACKET_OPEN:
            valuePromise = Promise.resolve([]);
            break;
        case TokenType.BRACKET_CLOSE:
            valuePromise = Promise.resolve([]);
            break;
        default:
            valuePromise = Promise.resolve([]);
    }

    return valuePromise.then(list => {
        if (isGuessed && nextTokenTypes.includes(TokenType.BRACKET_OPEN)) {
            list = list.concat(["("]);
        }
        if (isGuessed && nextTokenTypes.includes(TokenType.BRACKET_CLOSE) && bracketDepth > 0) {
            list = list.concat(")");
        }
        return list;
    });

}
