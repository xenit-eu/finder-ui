import { Token, TokenType } from "./lexer";

export type AstJson_t = { and: AstJson_t[] } | { or: AstJson_t[] } | { property: { field: string, operator: string, value: string } };

export interface IASTNode {
    toJSON(): AstJson_t;
    toString(): string;
}

export class InternalError extends Error {};

class Condition implements IASTNode {
    public constructor(public condition: "and"|"or", public nodes: IASTNode[]) {};

    public toJSON(): AstJson_t {
        switch (this.condition) {
            case "and":
                return {
                    and: this.nodes.map(node => node.toJSON()),
                };
            case "or":
                return {
                    or: this.nodes.map(node => node.toJSON()),
                };
            default:
                throw new TypeError("Condition is required to be 'and' or 'or', got " + this.condition);
        }
    }

    public toString(): string {
        return this.nodes.map(node => (node instanceof Condition ? ("(" + node + ")") : node).toString()).join(" " + this.condition + " ");
    }
}

class Property implements IASTNode {
    public constructor(public field: string, public operator: string, public value: string) {};

    public toJSON(): AstJson_t {
        return {
            property: {
                field: this.field,
                operator: this.operator,
                value: this.value,
            },
        };
    }

    public toString(): string {
        return this.field + " " + this.operator + " " + this.value;
    }
}

function astProperty(tokens: Token[]): Property {
    let field = tokens.shift();
    let operator = tokens.shift();
    let value = tokens.shift();
    if (!field || !operator || !value) {
        throw new InternalError("Missing part of property expression");
    }
    return new Property(field.value, operator.value, value.value);
}

function astCondition(tokens: Token[], firstNode: IASTNode | null): Condition {
    let conditionToken = tokens.shift();
    if(!conditionToken) {
        throw new InternalError("conditionToken is null");
    }
    let conditionType = conditionToken.value.toLowerCase();
    if(conditionType !== "and" && conditionType !== "or") {
        throw new InternalError("Condition must be 'and' or 'or', got " + JSON.stringify(conditionType));
    }
    if(!firstNode) {
        throw new InternalError("firstNode is null.");
    }
    if(firstNode instanceof Condition && conditionType === firstNode.condition) {
        return firstNode;
    }
    return new Condition(conditionType, [firstNode]);
}

export function expectedNextType(token?: Token|null): TokenType[] {
    if (!token) {
        return [TokenType.FIELD, TokenType.BRACKET_OPEN, TokenType.END];
    }
    switch (token.type) {
        case TokenType.FIELD:
            return [TokenType.OPERATOR];
        case TokenType.OPERATOR:
            return [TokenType.VALUE];
        case TokenType.VALUE:
            return [TokenType.CONDITION, TokenType.BRACKET_CLOSE, TokenType.END];
        case TokenType.CONDITION:
            return [TokenType.FIELD, TokenType.BRACKET_OPEN];
        case TokenType.BRACKET_OPEN:
            return [TokenType.FIELD];
        case TokenType.BRACKET_CLOSE:
            return [TokenType.CONDITION, TokenType.END];
        case TokenType.END:
            return [];
        default:
            return [];
    }

}

export function validateStream(tokens: Token[]) {
    let currentToken: Token|null = null;
    let depth = 0;
    tokens = tokens.filter(t => t.type !== TokenType.WHITESPACE).concat([new Token(TokenType.END, "")]);

    for(let i = 0; i < tokens.length; i++) {
        let expectedTypes = expectedNextType(currentToken);
        currentToken = tokens[i];

        if (i === tokens.length - 1) {
            // Condition can not be at the end of the string
            expectedTypes = expectedTypes.filter(t => t !== TokenType.CONDITION);
        }
        if(depth <= 0) {
            // Can not close more braces than there are opened
            expectedTypes = expectedTypes.filter(t => t !== TokenType.BRACKET_CLOSE);
        }

        switch(currentToken.type) {
            case TokenType.BRACKET_OPEN:
                depth++;
            break;
            case TokenType.BRACKET_CLOSE:
                depth--;
                break;
            default:
        }

        if(depth > 0) {
            // Can not have EOL before all braces are closed
            expectedTypes = expectedTypes.filter(t => t !== TokenType.END);
        }
        if(expectedTypes.indexOf(currentToken.type) < 0) {
            // tslint:disable-next-line:no-console
            console.debug("Token stream: "+tokens.map(t => t.toString()).join(" "));
            throw new SyntaxError("Unexpected token " + currentToken + " at token " + i + ". Expected " + JSON.stringify(expectedTypes.map(type => TokenType[type])));
        }
    }

}

function toAst(tokens: Token[], depth: number = 0): IASTNode|null {
    let firstProperty: IASTNode|null = null;
    let condition: Condition|null = null;
    let token: Token|null = null;
    // tslint:disable-next-line:no-conditional-assignment
    while(token = tokens[0]) {
        if(token.type === TokenType.FIELD) {
            if(!condition) {
                firstProperty = astProperty(tokens);
            } else {
                condition.nodes.push(astProperty(tokens));
            }
        }
        if(token.type === TokenType.CONDITION) {
            condition = astCondition(tokens, condition || firstProperty);
        }

        if(token.type === TokenType.BRACKET_OPEN) {
            tokens.shift();
            if(!condition) {
                firstProperty = toAst(tokens, depth + 1);
            } else {
                let ast = toAst(tokens, depth + 1);
                if(!ast) {
                    throw new InternalError("ast is null");
                }

                condition.nodes.push(ast);
            }
        }

        if(token.type === TokenType.BRACKET_CLOSE) {
            tokens.shift();
            if(depth > 0) {
                return condition||firstProperty;
            } else {
                throw new InternalError("Unexpected token " + token + ". (depth = " + depth + ")");
            }
        }
    }

    if(depth === 0) {
        return condition||firstProperty;
    } else {
        throw new InternalError("Unexpected end of expression. (depth = " + depth + ")");
    }
}

export default function parse(tokens: Token[]): IASTNode|null {
    let filteredTokens = tokens.filter(t => t.type !== TokenType.WHITESPACE);
    validateStream(filteredTokens);
    return toAst(filteredTokens);
}
