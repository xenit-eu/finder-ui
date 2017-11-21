import {StringStream} from "codemirror";

export enum TokenType {
    FIELD,
    OPERATOR,
    VALUE,
    CONDITION,
    WHITESPACE,
    BRACKET_OPEN,
    BRACKET_CLOSE,
};

export class Token {
    public constructor(public type: TokenType, public value: string) {
    }

    public toString(): string {
        return TokenType[this.type]+"("+JSON.stringify(this.value)+")";
    }
};

type ParseState_t = {
    inString: boolean,
    fieldState: TokenType,
    firstField: boolean,
    depth: number,
};

function getNextFieldState(state: ParseState_t) {
    switch(state.fieldState) {
        case TokenType.FIELD:
            return TokenType.OPERATOR;
        case TokenType.OPERATOR:
            return TokenType.VALUE;
        case TokenType.VALUE:
            return TokenType.FIELD;
        default:
            return TokenType.FIELD;
    }
}

function eatUntil(stream: StringStream, regex: RegExp): string {
    let incrementalValue = "";
    while(!stream.eol()) {
        let char = stream.peek();
        if (char === null) {
            break;
        }
        if(regex.test(char)) {
            return incrementalValue;
        }
        incrementalValue+=stream.next();
    }
    return incrementalValue;
}

function nextField(state: ParseState_t, incrementalValue: string): Token {
    let nextState = getNextFieldState(state);
    let currentState = state.fieldState;
    if(currentState === TokenType.VALUE) {
        state.firstField = false;
    }

    state.fieldState = nextState;

    return new Token(currentState, incrementalValue);
}

export function initialState(): ParseState_t {
    return {
        inString: false,
        fieldState: TokenType.FIELD,
        firstField: true,
        depth: 0,
    };
}

export function parseIncremental(stream: StringStream, state: ParseState_t): Token {
    let char = stream.peek();
    if(state.inString) {
        let nextToken = nextField(state, eatUntil(stream, /"/));
        stream.next(); // Skip over "
        state.inString = false;
        return nextToken;
    }

    if(char !== null && " \n\r\t".indexOf(char) > -1 && !state.inString) {
        stream.next();
        return new Token(TokenType.WHITESPACE, char);
    }

    if(char === "(") {
        stream.next();
        state.firstField = true;
        state.depth++;
        return new Token(TokenType.BRACKET_OPEN, char);
    }

    if(char === ")") {
        stream.next();
        state.firstField = false;
        state.depth--;
        return new Token(TokenType.BRACKET_CLOSE, char);
    }

    if(stream.match("AND", true, true)) {
        return new Token(TokenType.CONDITION, "AND");
    } else if(stream.match("OR", true, true)) {
        return new Token(TokenType.CONDITION, "OR");
    }

    if(char === '"') {
        state.inString = true;
        stream.next();
        return parseIncremental(stream, state);
    }

    return nextField(state, eatUntil(stream, /[\r\n\t\s\(\)]/));
}

export function parse(str: string): Token[] {
    let state = initialState();
    let tokens: Token[] = [];
    let stream = new StringStream(str);

    while(!stream.eol()) {
        tokens.push(parseIncremental(stream, state));
    }
    return tokens;
}

export function parseUntil(str: string, pos: number): Token[] {
    let state = initialState();
    let tokens: Token[] = [];
    let stream: StringStream = new StringStream(str);

    while(stream.pos < pos && ! stream.eol()) {
        tokens.push(parseIncremental(stream, state));
    }
    return tokens;
}

export function expectedNextType(token?: Token): TokenType[] {
    if(!token) {
        return [TokenType.FIELD];
    }
    switch(token.type) {
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
