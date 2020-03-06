import {highlightInfo, parseHighlights, splitHighlightSnippet, toHighlightInfos} from "./highlightRenderer";

let prefix = "<em>";
let postfix = "</em>";
let parsedExample = "<em>Quick</em> brown fox jumped over the lazy dog";
let output = ["", "Quick", " brown fox jumped over the lazy dog"];
let expectedHighlightInfos: highlightInfo = [{text: "", highlighted: false },
{text: "Quick", highlighted: true },
{text: " brown fox jumped over the lazy dog", highlighted: false }];

describe("highlight", () => {
    it("Expect String to be split on the delimiters", () => {
        let splitting = splitHighlightSnippet(parsedExample, prefix, postfix);
        expect(splitting).toEqual(output);
    });
    it("Expect results of splitting to be converted into hilightInfos: empty string input", () => {
        let highlightInfos = toHighlightInfos(output);
        expect(highlightInfos).toEqual(expectedHighlightInfos);
    });
    it("Expect input to be split on delimiters and returned as highlightInfos denoting whether the split part needs to be highlihgted", () => {
        let highlightInfo = parseHighlights(parsedExample);
        expect(highlightInfo).toEqual(expectedHighlightInfos);
    });
});
