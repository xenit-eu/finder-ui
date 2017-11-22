import { Editor, Pos, Position, StringStream } from "codemirror";
import { expectedNextType } from "./ast";
import { initialState, lexIncremental, lexUntil, Token, TokenType } from "./lexer";
import getHints, { IAutocompleteProvider } from "./typeahead";

export function insertHint(cm: Editor, self: {from: Position, to: Position}, data: {text: string}) {
    let doc = cm.getDoc();
    let nextCharPos = {
        line: self.to.line,
        ch: self.to.ch+1,
    };
    let nextChar = doc.getRange(self.to, nextCharPos)|| " ";
    doc.replaceRange(data.text + nextChar, self.from, nextCharPos);
    cm.focus();
}

function quoteStringIfRequired(text?: String): String | null | undefined {
    if(text && text.indexOf(" ") >= 0) {
        return JSON.stringify(text);
    }
    return text;
}

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
            list: items.map(item => { return (typeof item === "string") ? ({ text: item, hint: insertHint }) : ({ ...item, hint: insertHint }); })
                .map(item => ({ ...item, text: quoteStringIfRequired(item.text) })),
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
