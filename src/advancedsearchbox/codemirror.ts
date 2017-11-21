import {Editor, Pos, StringStream} from "codemirror";
import { initialState, parseIncremental, parseUntil, Token, TokenType, expectedNextType } from "./parser";
import getHints, { IAutocompleteProvider } from "./typeahead";

export function createHinter(autocomplete: IAutocompleteProvider) {
    let parseCache: Array<{text: string, ch: number, tokens: Token[]}> = [];
    return (cm: Editor) => new Promise((resolve) => {
        let cursorPos = cm.getDoc().getCursor();
        let lineContents = cm.getDoc().getLine(cursorPos.line);

        let cmTokens = cm.getLineTokens(cursorPos.line).filter(token => token.start < cursorPos.ch);

        let cacheLine = parseCache.find(line => line.text === lineContents && line.ch === cursorPos.ch);

        let tokens = parseUntil(lineContents, cursorPos.ch);

        let lastCmToken = cmTokens[cmTokens.length - 1];

        let insertedTok = 0;
        if(tokens[tokens.length - 1].type === TokenType.WHITESPACE) {
            insertedTok = 1;
            tokens.push(new Token(expectedNextType(tokens.filter(t => t.type !== TokenType.WHITESPACE).pop
        ())[0], ""));
        }

        getHints(autocomplete, tokens).then(items => ({
            list: items,
            from: Pos(cursorPos.line, lastCmToken.start+insertedTok),
            to: Pos(cursorPos.line, lastCmToken.end),
        })).then(resolve);
    });
}

export function createMode() {
    return () => ({
        startState: initialState,
        token: (stream: StringStream, state: any) => TokenType[parseIncremental(stream, state).type].toLowerCase(),
    });
}
