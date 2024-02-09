import { ADD_A_COMMENT } from "./comment";
import {
    DATE_BETWEEN, DATE_FROM, DATE_LAST6MONTH, DATE_LASTMONTH, DATE_LASTWEEK, DATE_LASTYEAR, DATE_ON, DATE_RANGE_PICK, DATE_TODAY, DATE_UNTIL,
} from "./search/DateRange";
import { PLACEHOLDERTRANSLATION } from "./search/searchbox";
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
export const FRENCH_BASE = "fr";
export const ENGLISH_BASE = "en";
export const DUTCH_BASE = "nl";
export const SPANISH_BASE = "es";
export const FRENCH = "fr-BE";
export const ENGLISH = "en-US";
export const DUTCH = "nl-BE";
export const SPANISH = "es-ES";
type Translation = { [word: string]: string };

//In case adding new language, change this interface to get typed checked assurance that you translate everything.
// tslint:disable-next-line:interface-name
export interface TranslationsChecked {
    [FRENCH]: Translation;
    [ENGLISH]: Translation;
    [DUTCH]: Translation;
    [SPANISH]: Translation;
    [FRENCH_BASE]: Translation;
    [ENGLISH_BASE]: Translation;
    [DUTCH_BASE]: Translation;
    [SPANISH_BASE]: Translation;
};
export const EmptyTranslations: TranslationsChecked = {
    [FRENCH]: {},
    [ENGLISH]: {},
    [DUTCH]: {},
    [SPANISH]: {},
    [FRENCH_BASE]: {},
    [ENGLISH_BASE]: {},
    [DUTCH_BASE]: {},
    [SPANISH_BASE]: {},
};
export type GetLanguage = () => string;
export type Translations = { [lang: string]: { [word: string]: string } };
export class WordTranslator {
    public constructor(private languageSelection: GetLanguage, private translations: TranslationsChecked = EmptyTranslations) {
    }
    public translateWord(word: string) {
        const lang = this.languageSelection();
        const translated = this.translations[lang] && this.translations[lang][word];
        return translated ? translated : word;
    }
}

const datewordTranslations: TranslationsChecked = {
    [ENGLISH]: {
        [DATE_ON]: DATE_ON,
        [DATE_FROM]: DATE_FROM,
        [DATE_UNTIL]: DATE_UNTIL,
        [DATE_TODAY]: DATE_TODAY,
        [DATE_LASTWEEK]: DATE_LASTWEEK,
        [DATE_LASTMONTH]: DATE_LASTMONTH,
        [DATE_LAST6MONTH]: DATE_LAST6MONTH,
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
        [DATE_LAST6MONTH]: "cette 6 mois",
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
        [DATE_LAST6MONTH]: "deze 6 maanden",
        [DATE_LASTYEAR]: "dit jaar",
        [DATE_RANGE_PICK]: "kies een datum bereik...",
        [DATE_BETWEEN]: "Tussen...",
    },
    [SPANISH]: {
        [DATE_ON]: "en...",
        [DATE_FROM]: "desde...",
        [DATE_UNTIL]: "hasta...",
        [DATE_TODAY]: "hoy",
        [DATE_LASTWEEK]: "la semana pasada",
        [DATE_LASTMONTH]: "el mes pasado",
        [DATE_LAST6MONTH]: "ultimos 6 meses",
        [DATE_LASTYEAR]: "el año pasado",
        [DATE_RANGE_PICK]: "elige un rango de fechas...",
        [DATE_BETWEEN]: "Entre...",
    },
    [ENGLISH_BASE]: {
        [DATE_ON]: DATE_ON,
        [DATE_FROM]: DATE_FROM,
        [DATE_UNTIL]: DATE_UNTIL,
        [DATE_TODAY]: DATE_TODAY,
        [DATE_LASTWEEK]: DATE_LASTWEEK,
        [DATE_LASTMONTH]: DATE_LASTMONTH,
        [DATE_LAST6MONTH]: DATE_LAST6MONTH,
        [DATE_LASTYEAR]: DATE_LASTYEAR,
        [DATE_RANGE_PICK]: DATE_RANGE_PICK,

    },
    [FRENCH_BASE]: {
        [DATE_ON]: "à...",
        [DATE_FROM]: "a partir de...",
        [DATE_UNTIL]: "jusqu'a...",
        [DATE_TODAY]: "Aujourd'hui",
        [DATE_LASTWEEK]: "cette semaine",
        [DATE_LASTMONTH]: "cette mois",
        [DATE_LAST6MONTH]: "cette 6 mois",
        [DATE_LASTYEAR]: "cette annee",
        [DATE_RANGE_PICK]: "choisissez une plage de dates...",
        [DATE_BETWEEN]: "Entre...",
    },
    [DUTCH_BASE]: {
        [DATE_ON]: "op...",
        [DATE_FROM]: "vanaf...",
        [DATE_UNTIL]: "tot...",
        [DATE_TODAY]: "vandaag",
        [DATE_LASTWEEK]: "deze week",
        [DATE_LASTMONTH]: "deze maand",
        [DATE_LAST6MONTH]: "deze 6 maanden",
        [DATE_LASTYEAR]: "dit jaar",
        [DATE_RANGE_PICK]: "kies een datum bereik...",
        [DATE_BETWEEN]: "Tussen...",
    },
    [SPANISH_BASE]: {
        [DATE_ON]: "en...",
        [DATE_FROM]: "desde...",
        [DATE_UNTIL]: "hasta...",
        [DATE_TODAY]: "hoy",
        [DATE_LASTWEEK]: "la semana pasada",
        [DATE_LASTMONTH]: "el mes pasado",
        [DATE_LAST6MONTH]: "ultimos 6 meses",
        [DATE_LASTYEAR]: "el año pasado",
        [DATE_RANGE_PICK]: "elige un rango de fechas...",
        [DATE_BETWEEN]: "Entre...",
    },
};

const folderWordTranslations: TranslationsChecked = {
    [ENGLISH]: {
        [FOLDER]: FOLDER,
    },
    [FRENCH]: {
        [FOLDER]: "Dossier",
    },
    [DUTCH]: {
        [FOLDER]: "Map",
    },
    [SPANISH]: {
        [FOLDER]: "Carpeta",
    },
    [ENGLISH_BASE]: {
        [FOLDER]: FOLDER,
    },
    [FRENCH_BASE]: {
        [FOLDER]: "Dossier",
    },
    [DUTCH_BASE]: {
        [FOLDER]: "Map",
    },
    [SPANISH_BASE]: {
        [FOLDER]: "Carpeta",
    },
};

const textWordTranslations: TranslationsChecked = {
    [ENGLISH]: {
        [TEXT]: TEXT,
    },
    [FRENCH]: {
        [TEXT]: "Texte",
    },
    [DUTCH]: {
        [TEXT]: "Tekst",
    },
    [SPANISH]: {
        [TEXT]: "Texto",
    },
    [ENGLISH_BASE]: {
        [TEXT]: TEXT,
    },
    [FRENCH_BASE]: {
        [TEXT]: "Texte",
    },
    [DUTCH_BASE]: {
        [TEXT]: "Tekst",
    },
    [SPANISH_BASE]: {
        [TEXT]: "Texto",
    },
};

const AllWordTranslations: TranslationsChecked = {
    [ENGLISH]: {
        [ALL]: ALL,
    },
    [FRENCH]: {
        [ALL]: "Tout",
    },
    [DUTCH]: {
        [ALL]: "Alles",
    },
    [SPANISH]: {
        [ALL]: "Todo",
    },
    [ENGLISH_BASE]: {
        [ALL]: ALL,
    },
    [FRENCH_BASE]: {
        [ALL]: "Tout",
    },
    [DUTCH_BASE]: {
        [ALL]: "Alles",
    },
    [SPANISH_BASE]: {
        [ALL]: "Todo",
    },
};

export const logicWordTranslations: TranslationsChecked = {
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
    [SPANISH]: {
        [AND]: "Y",
        [OR]: "O",
    },
    [ENGLISH_BASE]: {
        [AND]: AND,
        [OR]: OR,
    },
    [FRENCH_BASE]: {
        [AND]: "Et",
        [OR]: "Ou",
    },
    [DUTCH_BASE]: {
        [AND]: "En",
        [OR]: "Of",
    },
    [SPANISH_BASE]: {
        [AND]: "Y",
        [OR]: "O",
    },
};

export const subqueryTranslations: TranslationsChecked = {
    [ENGLISH]: {
        [SUBQUERY]: SUBQUERY,
    },
    [FRENCH]: {
        [SUBQUERY]: "Sous-requête",
    },
    [DUTCH]: {
        [SUBQUERY]: "Deelzoekopdracht",
    },
    [SPANISH]: {
        [SUBQUERY]: "Subconsulta",
    },
    [ENGLISH_BASE]: {
        [SUBQUERY]: SUBQUERY,
    },
    [FRENCH_BASE]: {
        [SUBQUERY]: "Sous-requête",
    },
    [DUTCH_BASE]: {
        [SUBQUERY]: "Deelzoekopdracht",
    },
    [SPANISH_BASE]: {
        [SUBQUERY]: "Subconsulta",
    },
};
export const aspectTranslations: TranslationsChecked = {
    [ENGLISH]: {
        [ASPECT]: ASPECT,
    },
    [FRENCH]: {
        [ASPECT]: "aspect",
    },
    [DUTCH]: {
        [ASPECT]: "aspect",
    },
    [SPANISH]: {
        [ASPECT]: "aspecto",
    },
    [ENGLISH_BASE]: {
        [ASPECT]: ASPECT,
    },
    [FRENCH_BASE]: {
        [ASPECT]: "aspect",
    },
    [DUTCH_BASE]: {
        [ASPECT]: "aspect",
    },
    [SPANISH_BASE]: {
        [ASPECT]: "aspecto",
    },
};
export const noderefTranslations: TranslationsChecked = {
    [ENGLISH]: {
        [NODEREF]: NODEREF,
    },
    [FRENCH]: {
        [NODEREF]: NODEREF,
    },
    [DUTCH]: {
        [NODEREF]: NODEREF,
    },
    [SPANISH]: {
        [NODEREF]: NODEREF,
    },
    [ENGLISH_BASE]: {
        [NODEREF]: NODEREF,
    },
    [FRENCH_BASE]: {
        [NODEREF]: NODEREF,
    },
    [DUTCH_BASE]: {
        [NODEREF]: NODEREF,
    },
    [SPANISH_BASE]: {
        [NODEREF]: NODEREF,
    },
};
export const typeTranslations: TranslationsChecked = {
    [ENGLISH]: {
        [TYPE]: TYPE,
    },
    [FRENCH]: {
        [TYPE]: "Type de document",
    },
    [DUTCH]: {
        [TYPE]: "Documenttype",
    },
    [SPANISH]: {
        [TYPE]: "Tipo de documento",
    },
    [ENGLISH_BASE]: {
        [TYPE]: TYPE,
    },
    [FRENCH_BASE]: {
        [TYPE]: "Type de document",
    },
    [DUTCH_BASE]: {
        [TYPE]: "Documenttype",
    },
    [SPANISH_BASE]: {
        [TYPE]: "Tipo de documento",
    },
};
export const translateSearchboxTranslations: TranslationsChecked = {
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
    [SPANISH]: {
        [SELECTINTENDEDQUERY]: "Seleccione la consulta deseada.",
        [PLACEHOLDERTRANSLATION]: "Escriba el palabra de búsqueda/Consulta o 'Enter' para iniciar la búsqueda",
    },
    [ENGLISH_BASE]: {
        [PLACEHOLDERTRANSLATION]: "Type search term/query or 'Enter' to start searching",
        [SELECTINTENDEDQUERY]: SELECTINTENDEDQUERY,
    },
    [FRENCH_BASE]: {
        [PLACEHOLDERTRANSLATION]: "Taper un terme de recherche ou 'Entrer' pour lancer la recherche",
        [SELECTINTENDEDQUERY]: "Sélectionnez la requête souhaitée.",
    },
    [DUTCH_BASE]: {
        [SELECTINTENDEDQUERY]: "Selecteer de bedoelde zoekopdracht.",
        [PLACEHOLDERTRANSLATION]: "Vul een zoekterm in of type 'Enter' om te zoeken",
    },
    [SPANISH_BASE]: {
        [SELECTINTENDEDQUERY]: "Seleccione la consulta deseada.",
        [PLACEHOLDERTRANSLATION]: "Escriba el palabra de búsqueda/Consulta o 'Enter' para iniciar la búsqueda",
    },

};
export const translateComments: TranslationsChecked = {
    [ENGLISH]: {
        [ADD_A_COMMENT]: ADD_A_COMMENT,
    },
    [FRENCH]: {
        [ADD_A_COMMENT]: "ajouter un commentaire...",
    },
    [DUTCH]: {
        [ADD_A_COMMENT]: "Voeg commentaar toe...",
    },
    [SPANISH]: {
        [ADD_A_COMMENT]: "Añadir un comentario...",
    },
    [ENGLISH_BASE]: {
        [ADD_A_COMMENT]: ADD_A_COMMENT,
    },
    [FRENCH_BASE]: {
        [ADD_A_COMMENT]: "ajouter un commentaire...",
    },
    [DUTCH_BASE]: {
        [ADD_A_COMMENT]: "Voeg commentaar toe...",
    },
    [SPANISH_BASE]: {
        [ADD_A_COMMENT]: "Añadir un comentario...",
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
            typeTranslations);
        super(languageSelection, merged);
    }
}
