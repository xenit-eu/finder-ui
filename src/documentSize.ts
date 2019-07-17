export type DocumentSizeRange_t = { start: string, end: string };
export const DocumentSizeBetween = "Between";
export const DocumentSizeBetweenAnd = "and";
export const DocumentSizeAtLeast = "At least";
function getByteWord(nbBytes: string) {
    let nbBytesI = parseInt(nbBytes, 10);
    let sizeGroup = 0;
    while (nbBytesI >= 1024) {
        nbBytesI /= 1024;
        sizeGroup++;
    }
    return nbBytesI + " " + ["B", "KB", "MB", "GB", "TB"][sizeGroup];
}
export function GetSizeTranslation(translate: (word: string) => string, value: DocumentSizeRange_t) {
    const min = value.start;
    const max = value.end;
    if (max === "MAX") {
        return translate(DocumentSizeAtLeast) + " " + getByteWord(min);
    }
    return translate(DocumentSizeBetween) + " " + getByteWord(min) + " " + translate(DocumentSizeBetweenAnd) + " " + getByteWord(max);
}
