import {
    DATE_BETWEEN, DATE_FROM, DATE_LASTMONTH, DATE_LASTWEEK, DATE_LASTYEAR, DATE_ON, DATE_RANGE_PICK, DATE_TODAY, DATE_UNTIL,
} from "./search/DateRange";
import { PLACEHOLDERTRANSLATION } from "./search/searchbox";
import { ADD_A_COMMENT } from "./comment";
import { DOCUMENT_NO_VERSION_HISTORY } from "./versionhistoryPanel";
export const FOLDER = "Folder";
export const TEXT = "text";
export const ASPECT = "aspect";
export const ALL = "All";
export const AND = "And";
export const OR = "Or";
export const SELECTINTENDEDQUERY = "Select the intended query.";
export const SUBQUERY = "Subquery";
export const NODEREF = "Noderef";
export const TYPE = "Document type";
export const FRENCH = "fr-be";
export const ENGLISH = "en-us";
export const DUTCH = "nl-be";
export type GetLanguage = () => string;
export type Translations = { [lang: string]: { [word: string]: string } };
export class WordTranslator {
    public constructor(private languageSelection: GetLanguage, private translations: Translations = {}) {
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
        [DATE_ON]: "à...",
        [DATE_FROM]: "a partir de...",
        [DATE_UNTIL]: "jusqu'a...",
        [DATE_TODAY]: "Aujourd'hui",
        [DATE_LASTWEEK]: "cette semaine",
        [DATE_LASTMONTH]: "cette mois",
        [DATE_LASTYEAR]: "cette annee",
        [DATE_RANGE_PICK]: "choisissez une plage de dates...",
        [DATE_BETWEEN]: "Entre...",
    },
    [DUTCH]: {
        [DATE_ON]: "op...",
        [DATE_FROM]: "vanaf...",
        [DATE_UNTIL]: "tot...",
        [DATE_TODAY]: "vandaag",
        [DATE_LASTWEEK]: "deze week",
        [DATE_LASTMONTH]: "deze maand",
        [DATE_LASTYEAR]: "dit jaar",
        [DATE_RANGE_PICK]: "kies een datum bereik...",
        [DATE_BETWEEN]: "Tussen...",

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
export const aspectTranslations = {
    [ENGLISH]: {
        [ASPECT]: ASPECT,
    },
    [FRENCH]: {
        [ASPECT]: "aspect",
    },
    [DUTCH]: {
        [ASPECT]: "aspect",
    },
};
export const noderefTranslations = {
    [ENGLISH]: {
        [NODEREF]: NODEREF,
    },
    [FRENCH]: {
        [NODEREF]: NODEREF,
    },
    [DUTCH]: {
        [NODEREF]: NODEREF,
    },
};
export const typeTranslations = {
    [ENGLISH]: {
        [TYPE]: TYPE,
    },
    [FRENCH]: {
        [TYPE]: "Type de document",
    },
    [DUTCH]: {
        [TYPE]: "Documenttype",
    },
};
export const translateSearchboxTranslations = {
    [ENGLISH]: {
        [PLACEHOLDERTRANSLATION]: "Type search term/query or 'Enter' to start searching",
        [SELECTINTENDEDQUERY]: SELECTINTENDEDQUERY,
    },
    [FRENCH]: {
        [PLACEHOLDERTRANSLATION]: "Taper un terme de recherche ou 'Entrer' pour lancer la recherche",
        [SELECTINTENDEDQUERY]: "Sélectionnez la requête souhaitée.",
    },
    [DUTCH]: {
        [SELECTINTENDEDQUERY]: "Selecteer de bedoelde zoekopdracht.",
        [PLACEHOLDERTRANSLATION]: "Vul een zoekterm in of type 'Enter' om te zoeken",

    },

};
export const translateComments = {
    [ENGLISH]: {
        [ADD_A_COMMENT]: ADD_A_COMMENT,
    },
    [FRENCH]: {
        [ADD_A_COMMENT]: "ajouter un commentaire...",
    },
    [DUTCH]: {
        [ADD_A_COMMENT]: "Voeg commentaar toe...",
    },
};
export const translateVersions = {
    [ENGLISH]: {
        [DOCUMENT_NO_VERSION_HISTORY]: DOCUMENT_NO_VERSION_HISTORY,
    },
    [FRENCH]: {
        [DOCUMENT_NO_VERSION_HISTORY]: "Le document n'a pas d'historique de version.",
    },
    [DUTCH]: {
        [DOCUMENT_NO_VERSION_HISTORY]: "Het document heeft geen versie geschiedenis.",
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
        const merged = mergeDeep(
            {},
            AllWordTranslations,
            aspectTranslations,
            datewordTranslations,
            folderWordTranslations,
            logicWordTranslations,
            noderefTranslations,
            textWordTranslations,
            translateSearchboxTranslations,
            translateComments,
            translateVersions,
            typeTranslations);
        super(languageSelection, merged);
    }
}
