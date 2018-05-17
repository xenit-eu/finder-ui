import {
    DATE_FROM, DATE_LASTMONTH, DATE_LASTWEEK, DATE_LASTYEAR, DATE_ON, DATE_RANGE_PICK, DATE_TODAY, DATE_UNTIL,
} from "./DateRange";
export const FOLDER = "Folder";
export const TEXT = "text";
export const ALL = "All";
export const AND = "And";
export const OR = "Or";
export const SUBQUERY = "Subquery";
const FRENCH = "fr-be";
const ENGLISH = "en-us";
const DUTCH = "nl-be";
export class WordTranslator {
    public constructor(private languageSelection: () => string, private translations: { [lang: string]: { [word: string]: string } } = {}) {
    }
    public translateWord(word: string) {
        const lang = this.languageSelection();
        const translated = this.translations[lang] && this.translations[lang][word];
        return translated ? translated : word;
    }
}
const datewordTranslations = {
    [ENGLISH]: {
        [DATE_ON]: DATE_ON,
        [DATE_FROM]: DATE_FROM,
        [DATE_UNTIL]: DATE_UNTIL,
        [DATE_TODAY]: DATE_TODAY,
        [DATE_LASTWEEK]: DATE_LASTWEEK,
        [DATE_LASTMONTH]: DATE_LASTMONTH,
        [DATE_LASTYEAR]: DATE_LASTYEAR,
        [DATE_RANGE_PICK]: DATE_RANGE_PICK,
    },
    [FRENCH]: {
        [DATE_ON]: "à",
        [DATE_FROM]: "a partir de",
        [DATE_UNTIL]: "jusqu'a",
        [DATE_TODAY]: "Aujourd'hui",
        [DATE_LASTWEEK]: "cette semaine",
        [DATE_LASTMONTH]: "cette mois",
        [DATE_LASTYEAR]: "cette annee",
        [DATE_RANGE_PICK]: "choisissez un date",
    },
    [DUTCH]: {
        [DATE_ON]: "op",
        [DATE_FROM]: "vanaf",
        [DATE_UNTIL]: "tot",
        [DATE_TODAY]: "vandaag",
        [DATE_LASTWEEK]: "deze week",
        [DATE_LASTMONTH]: "deze maand",
        [DATE_LASTYEAR]: "dit jaar",
        [DATE_RANGE_PICK]: "kies een datum",
    },
};

const folderWordTranslations = {
    [ENGLISH]: {
        [FOLDER]: FOLDER,
    },
    [FRENCH]: {
        [FOLDER]: "Dossier",
    },
    [DUTCH]: {
        [FOLDER]: "Map",
    },
};

const textWordTranslations = {
    [ENGLISH]: {
        [TEXT]: TEXT,
    },
    [FRENCH]: {
        [TEXT]: "Texte",
    },
    [DUTCH]: {
        [TEXT]: "Tekst",
    },
};

const AllWordTranslations = {
    [ENGLISH]: {
        [ALL]: ALL,
    },
    [FRENCH]: {
        [ALL]: "Tout",
    },
    [DUTCH]: {
        [ALL]: "Alles",
    },
};

export const logicWordTranslations = {
    [ENGLISH]: {
        [AND]: AND,
        [OR]: OR,
    },
    [FRENCH]: {
        [AND]: "Et",
        [OR]: "Ou",
    },
    [DUTCH]: {
        [AND]: "En",
        [OR]: "Of",
    },
};

export const subqueryTranslations = {

    [ENGLISH]: {
        [SUBQUERY]: SUBQUERY,
    },
    [FRENCH]: {
        [SUBQUERY]: "Sous-requête",
    },
    [DUTCH]: {
        [SUBQUERY]: "Deelzoekopdracht",
    },
};
function isObject(item: any) {
    return (item && typeof item === "object" && !Array.isArray(item));
}
export function mergeDeep(target: any, ...sources: any[]): any {
    for (const source of sources) {
        if (isObject(target) && isObject(source)) {
            for (const key in source) {
                if (isObject(source[key])) {
                    if (!target[key]) { Object.assign(target, { [key]: {} }); }
                    mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }
    }
    return target;
}
export class CombinedWordTranslator extends WordTranslator {
    public constructor(languageSelection: () => string) {
        const merged = mergeDeep({}, datewordTranslations, folderWordTranslations, textWordTranslations, AllWordTranslations, logicWordTranslations);
        super(languageSelection, merged);
    }
}
