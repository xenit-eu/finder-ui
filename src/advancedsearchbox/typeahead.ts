import {expectedNextType, parseUntil, Token, TokenType} from "./parser";

export type AutocompleteValue_t = string|{
    render?: (element: HTMLLIElement, data: any, cur: any) => void;
};

export interface IAutocompleteProvider {
    needFields(value: string): Promise<AutocompleteValue_t[]>;

    needOperators(field: string, value: string): Promise<AutocompleteValue_t[]>;

    needValues(field: string, operator: string, value: string): Promise<AutocompleteValue_t[]>;
}

export default function getHints(autocomplete: IAutocompleteProvider, tokens: Token[]): Promise<AutocompleteValue_t[]> {
        let lastToken = tokens[tokens.length-1];
        if(lastToken.type === TokenType.WHITESPACE) {
            return Promise.resolve([]);
        }
        let lastField = tokens.filter(t => t.type === TokenType.FIELD).pop();
        let lastOperator = tokens.filter(t => t.type === TokenType.OPERATOR).pop();
        let nonWhitespaceTokens = tokens.filter(t => t.type !== TokenType.WHITESPACE);

        let predictedTokenTypes = expectedNextType(nonWhitespaceTokens[nonWhitespaceTokens.length-2]);

        if(predictedTokenTypes.includes(TokenType.CONDITION)) {
            return Promise.resolve(["AND", "OR"]);
        }

        let valuePromise: Promise<AutocompleteValue_t[]> = Promise.resolve([]);
        switch(lastToken.type) {
            case TokenType.FIELD:
                valuePromise = autocomplete.needFields(lastToken.value);
                break;
            case TokenType.OPERATOR:
                if(lastField) {
                    valuePromise = autocomplete.needOperators(lastField.value, lastToken.value);
                }
                break;
            case TokenType.VALUE:
                if(lastField && lastOperator) {
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
        return valuePromise;
}
