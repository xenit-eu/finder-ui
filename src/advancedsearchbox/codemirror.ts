import { Editor, Pos, StringStream } from "codemirror";
import { expectedNextType, initialState, lexIncremental, lexUntil, Token, TokenType } from "./lexer";
import getHints, { IAutocompleteProvider } from "./typeahead";

export function createHinter(autocomplete: IAutocompleteProvider) {
    return (cm: Editor) => new Promise((resolve) => {
        let cursorPos = cm.getDoc().getCursor();
        let lineContents = cm.getDoc().getLine(cursorPos.line);

        let cmTokens = cm.getLineTokens(cursorPos.line).filter(token => token.start < cursorPos.ch);

        let tokens = lexUntil(lineContents, cursorPos.ch);

        if (tokens.length < 1 || cmTokens.length < 1) {
            return resolve({ list: [] });
        }

        let lastCmToken = cmTokens[cmTokens.length - 1];

        let insertedTok = 0;
        if (tokens[tokens.length - 1].type === TokenType.WHITESPACE) {
            insertedTok = 1;
            tokens.push(new Token(expectedNextType(tokens.filter(t => t.type !== TokenType.WHITESPACE).pop
                ())[0], ""));
        }

        getHints(autocomplete, tokens).then(items => ({
            list: items,
            from: Pos(cursorPos.line, lastCmToken.start + insertedTok),
            to: Pos(cursorPos.line, lastCmToken.end),
        })).then(resolve);
    });
}

export function createMode() {
    return () => ({
        startState: initialState,
        token: (stream: StringStream, state: any) => TokenType[lexIncremental(stream, state).type].toLowerCase(),
    });
}
