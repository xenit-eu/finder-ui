import { Editor, Pos, Position, StringStream } from "codemirror";
import { initialState, lexIncremental, lexUntil, Token, TokenType } from "./lexer";
import { expectedNextType } from "./parser";
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

function addHintFunction(item: string|{text: string}): {text: string, hint: any} {
    if(typeof item === "string") {
        return {
            text: item,
            hint: insertHint,
        };
    } else {
        return {
            ...item,
            hint: insertHint,
        };
    }
}

function quoteStringIfRequired(item: { text: string }): { text: string } {
    if(item.text && item.text.indexOf(" ") >= 0) {
        return {...item, text: JSON.stringify(item.text)};
    }
    return item;
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
            list: items.map(addHintFunction).map(quoteStringIfRequired),
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
