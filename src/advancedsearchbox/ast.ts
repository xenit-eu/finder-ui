import { Token, TokenType } from "./lexer";

interface IASTNode {
    toJSON(): any;
}

class Condition implements IASTNode {
    public constructor(public condition: "and"|"or", public nodes: IASTNode[]) {};

    public toJSON() {
        return {
            [this.condition]: this.nodes.map(node => node.toJSON()),
        };
    }
}

class Property implements IASTNode {
    public constructor(public field: string, public operator: string, public value: string) {};

    public toJSON() {
        return {
            property: {
                field: this.field,
                operator: this.operator,
                value: this.value,
            },
        };
    }
}

function astProperty(tokens: Token[]): Property {
    let field = tokens.shift();
    let operator = tokens.shift();
    let value = tokens.shift();
    if (!field || !operator || !value) {
        throw new SyntaxError("Missing part of property expression");
    }
    return new Property(field.value, operator.value, value.value);
}

function astCondition(tokens: Token[], firstNode: IASTNode | null): Condition {
    let conditionToken = tokens.shift();
    if(!conditionToken) {
        throw new SyntaxError("conditionToken is null");
    }
    let conditionType = conditionToken.value.toLowerCase();
    if(conditionType !== "and" && conditionType !== "or") {
        throw new SyntaxError("Condition must be 'and' or 'or', got " + JSON.stringify(conditionType));
    }
    if(!firstNode) {
        throw new TypeError("firstNode is null.");
    }
    if(firstNode instanceof Condition && conditionType === firstNode.condition) {
        return firstNode;
    }
    return new Condition(conditionType, [firstNode]);
}

export function expectedNextType(token?: Token|null): TokenType[] {
    if (!token) {
        return [TokenType.FIELD, TokenType.BRACKET_OPEN];
    }
    switch (token.type) {
        case TokenType.FIELD:
            return [TokenType.OPERATOR];
        case TokenType.OPERATOR:
            return [TokenType.VALUE];
        case TokenType.VALUE:
            return [TokenType.CONDITION, TokenType.BRACKET_CLOSE];
        case TokenType.CONDITION:
            return [TokenType.FIELD, TokenType.BRACKET_OPEN];
        case TokenType.BRACKET_OPEN:
            return [TokenType.FIELD];
        case TokenType.BRACKET_CLOSE:
            return [TokenType.CONDITION];
        default:
            return [TokenType.FIELD];
    }

}

export function validateStream(tokens: Token[]) {
    let currentToken: Token|null = null;

    for(let i = 0; i < tokens.length; i++) {
        let expectedTypes = expectedNextType(currentToken);
        currentToken = tokens[i];
        if(expectedTypes.indexOf(currentToken.type) < 0) {
            // tslint:disable-next-line:no-console
            console.debug("Token stream: "+tokens.map(t => t.toString()).join(" "));
            throw new SyntaxError("Unexpected token " + currentToken + " at position " + i + ". Expected " + JSON.stringify(expectedTypes.map(type => TokenType[type])));
        }
    }
}

function toAst(tokens: Token[]): IASTNode|null {
    validateStream(tokens);
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
                firstProperty = toAst(tokens);
            } else {
                let ast = toAst(tokens);
                if(!ast) {
                    throw new TypeError("ast is null");
                }

                condition.nodes.push(ast);
            }
        }

        if(token.type === TokenType.BRACKET_CLOSE) {
            tokens.shift();
            return condition||firstProperty;
        }
    }

    return condition||firstProperty;
}

export default function ast(tokens: Token[]): IASTNode|null {
    return toAst(tokens.filter(t => t.type !== TokenType.WHITESPACE));
}
