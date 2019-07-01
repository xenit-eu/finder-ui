import { Button, DialogActions, DialogContent, DialogTitle, Theme, Typography, WithStyles, withStyles } from "@material-ui/core";
import { Component, createElement as __, Fragment } from "react";
import { Column_t, ColumnGroup_t, ColumnSet_t, ColumnsPicker_t } from "..";
import AvailableColumns from "./availablecolumns";
import ColumnSetManager from "./columnset";
import SortableColumns from "./sortablecolumns";
import { arrayEquals, deepEqual } from "@xenit/finder-utils";
import { ENGLISH, FRENCH, DUTCH, WordTranslator, TranslationsChecked, SPANISH } from "../WordTranslator";
import Dialog from "../dialog";

type ColumnsPickerContent_Props_t = {
    opened: boolean,
    selectedColumns: string[], // list of names
    sets: ColumnSet_t[],
    onSetsChange: (sets: ColumnSet_t[]) => void,
    onDone: (selectedColumns: string[]) => void,
    columnGroups: ColumnGroup_t[],
    onDismiss: () => void,
    language: string,
    onClose: () => void,
} & WithStyles<"dialogTitle" | "dialogTitleText" | "subheading" | "hintText">;

type ColumnsPickerContent_State_t = {
    selected: string[],
    sets: ColumnSet_t[],
    selectedSet: string | null, // selected ColumnSet id.
};
const COLUMNS_TO_DISPLAY = "Columns to display";
const SAVED_COLUMN_SETS = "Saved column sets";
const OTHER_AVAILABLE_COLUMNS = "Other available columns";
const DRAG_AND_DROP = "Click a column title to show the column.";
const SAVE = "Save";
const translations: TranslationsChecked = {
    [ENGLISH]: {
        [COLUMNS_TO_DISPLAY]: COLUMNS_TO_DISPLAY,
        [SAVED_COLUMN_SETS]: SAVED_COLUMN_SETS,
        [OTHER_AVAILABLE_COLUMNS]: OTHER_AVAILABLE_COLUMNS,
        [DRAG_AND_DROP]: DRAG_AND_DROP,
        [SAVE]: SAVE,
    },
    [FRENCH]: {
        [COLUMNS_TO_DISPLAY]: "Colonnes à afficher",
        [SAVED_COLUMN_SETS]: "Jeux de colonnes enregistrés",
        [OTHER_AVAILABLE_COLUMNS]: "Autres colonnes disponibles",
        [DRAG_AND_DROP]: "Cliquez sur un titre de colonne pour afficher la colonne.",
        [SAVE]: "Sauvegarder",
    },
    [DUTCH]: {
        [COLUMNS_TO_DISPLAY]: "Te tonen kolommen",
        [SAVED_COLUMN_SETS]: "Opgegeslagen kolom sets",
        [OTHER_AVAILABLE_COLUMNS]: "Andere beschikbare kolommen",
        [DRAG_AND_DROP]: "Klik op een kolomtitel om de kolom te tonen.",
        [SAVE]: "Opslaan",
    },
    [SPANISH]:{
        [COLUMNS_TO_DISPLAY]: "Columnas para mostrar",
        [SAVED_COLUMN_SETS]: "Conjuntos de columnas guardadas",
        [OTHER_AVAILABLE_COLUMNS]: "Otras columnas disponibles",
        [DRAG_AND_DROP]: "Haga clic en el título de una columna para mostrar la columna.",
        [SAVE]: "Guardar",
    },
};
function getAllColumns(props: ColumnsPickerContent_Props_t): Column_t[] {
    return props.columnGroups.reduce((a, b) => a.concat(...b.columns), [] as Column_t[]);
}

function getDisplayedColumns(props: ColumnsPickerContent_Props_t, columns: string[]): Column_t[] {
    const allColumns = getAllColumns(props);
    const fixedColumns = allColumns.filter(c => c.fixed).filter(c => columns.indexOf(c.name) === -1);
    return fixedColumns.concat(columns.map(name => allColumns.find(col => col.name === name)!).filter(c => !!c));
}

function getSelectedAndSetsState(props: ColumnsPickerContent_Props_t) {
    return {
        selected: getDisplayedColumns(props, props.selectedColumns).map(col => col.name),
        sets: props.sets.map(set => ({
            ...set,
            columns: getDisplayedColumns(props, set.columns).map(col => col.name),
        })),
    };

}

/* @internal */
export class ColumnsPickerContent extends Component<ColumnsPickerContent_Props_t, ColumnsPickerContent_State_t> {
    private translate: WordTranslator;
    constructor(props: ColumnsPickerContent_Props_t) {
        super(props);
        this.state = {
            selectedSet: null,
            ...getSelectedAndSetsState(props),
        };
        this.translate = new WordTranslator(() => this.props.language, translations);
    }

    public componentWillReceiveProps(props: ColumnsPickerContent_Props_t) {
        if (!deepEqual(props.selectedColumns, this.props.selectedColumns) ||
            !deepEqual(props.sets, this.props.sets) ||
            !deepEqual(props.columnGroups, this.props.columnGroups)) {
            this.setState(getSelectedAndSetsState(props));
        }
    }

    private handleDone = () => {
        this.props.onDone(getDisplayedColumns(this.props, this.state.selected).map(col => col.name));
        this.props.onSetsChange(this.state.sets);
        this.props.onDismiss();
    }

    private onSelectColumnSet = (set: ColumnSet_t | null) => {
        if (!set) {
            this.setState({ selectedSet: null });
        } else {
            this.setState({
                selectedSet: set.id,
                selected: set.columns,
            });
        }
    }

    private onCreateColumnSet = (set: ColumnSet_t) => {
        this.setState(state => {
            const existingSet = state.sets.findIndex(s => s.id === set.id);
            if (existingSet === -1) {
                return {
                    selectedSet: set.id,
                    sets: state.sets.concat(set),
                };
            } else {
                return {
                    selectedSet: set.id,
                    sets: [...state.sets.slice(0, existingSet), set, ...state.sets.slice(existingSet + 1)],
                };
            }
        });
    }

    private onDeleteColumnSet = (set: ColumnSet_t) => {
        this.setState(state => ({
            sets: state.sets.filter(s => s.id !== set.id),
            selectedSet: null,
        }));
    }

    private onDeleteColumn = (column: Column_t) => {
        this.setState(s => ({
            selected: s.selected.filter(col => col !== column.name),
        }));
    }

    private onClickColumn = (col: Column_t) => {
        this.setState(state => {
            if (state.selected.find(sC => sC === col.name)) {
                return {
                    selected: state.selected.filter(sC => sC !== col.name),
                };
            } else {
                return {
                    selected: state.selected.concat([col.name]),
                };
            }
        });
    }

    private onCancel = () => {
        this.setState(getSelectedAndSetsState(this.props));
        this.props.onDismiss();
    }

    public render() {
        return __(Dialog, {
            key:"Dialog",
            open: this.props.opened,
            baseClassName: "columns-picker-dialog",
            dialogTitle: "Columns to display",
            onClose: this.props.onClose,
            onCancel: this.onCancel,
            handleDone: this.handleDone,
            language: this.props.language,
        },
            __(Typography, { key:"Typography0", variant: "subheading", className: this.props.classes!.subheading }, this.translate.translateWord(SAVED_COLUMN_SETS)),
            __(ColumnSetManager, {
                key:"columnSetManager",
                columnSets: this.state.sets,
                currentSet: this.state.selectedSet,
                currentColumns: this.state.selected,
                onSelect: this.onSelectColumnSet,
                onCreate: this.onCreateColumnSet,
                onDelete: this.onDeleteColumnSet,
                language: this.props.language,
                classes:"" as any}) ,
            __("div", { className: "columns-to-display-test-handle",key:"columns-to-display-test-handle" },
                __(Typography, { variant: "subheading", className: this.props.classes!.subheading }, this.translate.translateWord(COLUMNS_TO_DISPLAY)),
                __(SortableColumns, {
                    columns: getDisplayedColumns(this.props, this.state.selected),
                    onDeleteColumn: this.onDeleteColumn,
                    onSortColumns: (columns: Column_t[]) => this.setState({ selected: columns.map(col => col.name) }),
                })),
            __(Typography, { key:"Typography1",variant: "subheading", className: this.props.classes!.subheading }, this.translate.translateWord(OTHER_AVAILABLE_COLUMNS)),
            __(AvailableColumns, {
                availableColumns: this.props.columnGroups,
                selectedColumns: this.state.selected,
                onClickColumn: this.onClickColumn,
            }),
            __(Typography, { key:"Typography2",className: this.props.classes!.hintText }, this.translate.translateWord(DRAG_AND_DROP)),
        );
    }
}

export default withStyles((theme: Theme) => ({
    dialogTitle: {
        backgroundColor: theme.palette.primary.main,
    },
    dialogTitleText: {
        color: theme.palette.primary.contrastText,
    },
    subheading: {
        marginTop: theme.spacing.unit,
    },
    hintText: {
        marginTop: theme.spacing.unit,
        ...theme.typography.caption,
    },
}), { name: "FinderUIColumnsPicker" })(ColumnsPickerContent);
