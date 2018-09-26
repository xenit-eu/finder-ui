import { Button, DialogActions, DialogContent, DialogTitle, Theme, Typography, WithStyles, withStyles } from "@material-ui/core";
import { Component, createElement as __, Fragment } from "react";
import { Column_t, ColumnGroup_t, ColumnSet_t, ColumnsPicker_t } from "..";
import AvailableColumns from "./availablecolumns";
import ColumnSetManager from "./columnset";
import SortableColumns from "./sortablecolumns";
import { arrayEquals, deepEqual } from "finder-utils";
import { ENGLISH, FRENCH, DUTCH, WordTranslator } from "../search/WordTranslator";
import { ISynchronousTranslationService } from "../search";

type ColumnsPickerContent_Props_t = {
    selectedColumns: string[], // list of names
    sets: ColumnSet_t[],
    onSetsChange: (sets: ColumnSet_t[]) => void,
    onDone: (selectedColumns: string[]) => void,
    columnGroups: ColumnGroup_t[],
    onDismiss: () => void,
    language: string,
} & WithStyles<"dialogTitle" | "dialogTitleText" | "subheading" | "hintText">;

type ColumnsPickerContent_State_t = {
    selected: string[],
    sets: ColumnSet_t[],
    selectedSet: string | null, // selected ColumnSet id.
};
const COLUMNS_TO_DISPLAY = "Columns to display";
const SAVED_COLUMN_SETS = "Saved column sets";
const OTHER_AVAILABLE_COLUMNS = "Other available columns";
const DRAG_AND_DROP = "Drag and drop the name on the above section to display it.";
const CANCEL = "Cancel";
const SAVE = "Save";
const DONE = "Done";
const translations = {
    [ENGLISH]: {
        [COLUMNS_TO_DISPLAY]: COLUMNS_TO_DISPLAY,
        [SAVED_COLUMN_SETS]: SAVED_COLUMN_SETS,
        [OTHER_AVAILABLE_COLUMNS]: OTHER_AVAILABLE_COLUMNS,
        [DRAG_AND_DROP]: DRAG_AND_DROP,
        [CANCEL]: CANCEL,
        [SAVE]: SAVE,
        [DONE]: DONE,
    },
    [FRENCH]: {
        [COLUMNS_TO_DISPLAY]: "Colonnes à afficher",
        [SAVED_COLUMN_SETS]: "Jeux de colonnes enregistrés",
        [OTHER_AVAILABLE_COLUMNS]: "Autres colonnes disponibles",
        [DRAG_AND_DROP]: "Faites glisser et déposez le nom dans la section ci-dessus pour l'afficher.",
        [CANCEL]: "Annuler",
        [SAVE]: "Sauvegarder",
        [DONE]: "OK",
    },
    [DUTCH]: {
        [COLUMNS_TO_DISPLAY]: "Te tonen kolommen",
        [SAVED_COLUMN_SETS]: "Opgegeslagen kolom sets",
        [OTHER_AVAILABLE_COLUMNS]: "Andere beschikbare kolommen",
        [DRAG_AND_DROP]: "Sleep de naam van de kolom op bovenstaande sectie om de kolom te tonen.",
        [CANCEL]: "Annuleer",
        [SAVE]: "Sla op",
        [DONE]: "OK",
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
        return __(Fragment, {},
            __(DialogTitle, {
                className: this.props.classes!.dialogTitle,
                disableTypography: true,
            }, __(Typography, { className: this.props.classes!.dialogTitleText, variant: "title" }, this.translate.translateWord(COLUMNS_TO_DISPLAY)))),
            __(DialogContent, { className: "columns-picker-content" },
                __(Typography, { variant: "subheading", className: this.props.classes!.subheading }, this.translate.translateWord(SAVED_COLUMN_SETS)),
                __(ColumnSetManager, {
                    columnSets: this.state.sets,
                    currentSet: this.state.selectedSet,
                    currentColumns: this.state.selected,
                    onSelect: this.onSelectColumnSet,
                    onCreate: this.onCreateColumnSet,
                    onDelete: this.onDeleteColumnSet,
                    language: this.props.language,
                }),
                __(Typography, { variant: "subheading", className: this.props.classes!.subheading }, this.translate.translateWord(COLUMNS_TO_DISPLAY)),
                __(SortableColumns, {
                    columns: getDisplayedColumns(this.props, this.state.selected),
                    onDeleteColumn: this.onDeleteColumn,
                    onSortColumns: (columns: Column_t[]) => this.setState({ selected: columns.map(col => col.name) }),
                }),
                __(Typography, { variant: "subheading", className: this.props.classes!.subheading }, this.translate.translateWord(OTHER_AVAILABLE_COLUMNS)),
                __(AvailableColumns, {
                    availableColumns: this.props.columnGroups,
                    selectedColumns: this.state.selected,
                    onClickColumn: this.onClickColumn,
                }),
                __(Typography, { className: this.props.classes!.hintText }, this.translate.translateWord(DRAG_AND_DROP),
                ),
                __(DialogActions, { className: "actions-container" },
                    __(Button, {
                        onClick: this.onCancel,
                    }, this.translate.translateWord(CANCEL)),
                    __(Button, {
                        variant: "contained",
                        color: "primary",
                        onClick: this.handleDone,
                    }, this.translate.translateWord(DONE)),
                ),
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
