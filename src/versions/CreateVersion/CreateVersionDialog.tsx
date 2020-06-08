import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from "@material-ui/core";
import { Theme, WithStyles, withStyles } from "@material-ui/core/styles";
import type { CSSProperties } from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import classnames from "classnames";
import React, { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { ButtonWithIcon } from "../../button";
import { OverlayCentered } from "../../overlay";
import { UploadButton } from "../../upload";
import { IVersionPanelCreateVersion, VersionPanelCreateVersionType } from "./types";

type CreateVersionDialog_Props_t = {
    currentVersion: string,
    state: Partial<IVersionPanelCreateVersion>,
    onChange: (state: Partial<IVersionPanelCreateVersion>) => void,
};

const styles = (theme: Theme) => ({
    grid: {
        display: "grid",
        gridTemplateColumns: "[label] minmax(min-content, max-content) [field] minmax(min-content, max-content) [end]",
        columnGap: (2 * theme.spacing.unit) + "px",
        rowGap: theme.spacing.unit + "px",

    } as CSSProperties,
    gridCentered: {
        justifySelf: "center",
    },
    fullWidth: {
        gridColumnStart: "label",
        gridColumnEnd: "end",
    },
    label: {
        gridColumnStart: "label",
        gridColumnEnd: "field",
        justifySelf: "end",
        alignSelf: "start",

    } as CSSProperties,
    field: {
        gridColumnStart: "field",
        gridColumnEnd: "end",
        justifySelf: "start",
        alignSelf: "start",

    } as CSSProperties,
    textDisabled: {
        color: theme.palette.text.disabled,
    },
});
function CreateVersionDialog(props: CreateVersionDialog_Props_t & WithStyles<typeof styles>) {
    const { t } = useTranslation("finder-ui");
    const calculatedVersions = calculateNextVersion(props.currentVersion);
    return <div className={props.classes.grid}>
        <UploadButton className={classnames(props.classes.fullWidth, props.classes.gridCentered)} multiple={false} onFilesSelected={(files: readonly File[]) => props.onChange({
            ...props.state,
            file: files[0],
        })}>
            <ButtonWithIcon icon={<CloudUploadIcon />} variant="contained" color="primary">
                {t("versions/CreateVersion/upload-version")}
            </ButtonWithIcon>
        </UploadButton>

        <FormLabel component={"div" as any} className={props.classes.label}>{t("versions/CreateVersion/new-filename")}</FormLabel>
        {props.state.file ?
            <Typography className={props.classes.field}>{props.state.file.name}</Typography> :
            <Typography className={classnames(props.classes.field, props.classes.textDisabled)}>{t("versions/CreateVersion/no-file")}</Typography>
        }

        <Typography variant="title" className={props.classes.fullWidth}>{t("versions/CreateVersion/version-information")}</Typography>

        <FormLabel component={"div" as any} className={props.classes.label}>{t("versions/CreateVersion/version-change")}</FormLabel>
        <RadioGroup
            aria-label={t("versions/CreateVersion/version-change")}
            value={props.state.type ?? VersionPanelCreateVersionType.MINOR}
            onChange={(event: ChangeEvent<HTMLInputElement>) => props.onChange({
                ...props.state,
                type: event.target.value as VersionPanelCreateVersionType,
            })}
            className={props.classes.field}
        >
            <FormControlLabel
                value={VersionPanelCreateVersionType.MINOR}
                label={t("versions/CreateVersion/version-change-minor", {
                    newVersion: calculatedVersions[VersionPanelCreateVersionType.MINOR],
                })}
                control={<Radio />}
            />
            <FormControlLabel
                value={VersionPanelCreateVersionType.MAJOR}
                label={t("versions/CreateVersion/version-change-major", {
                    newVersion: calculatedVersions[VersionPanelCreateVersionType.MAJOR],
                })}
                control={<Radio />}
            />
        </RadioGroup>

        <FormLabel component={"div" as any} className={props.classes.label}>{t("versions/CreateVersion/version-comment")}</FormLabel>
        <TextField
            value={props.state.comment ?? ""}
            fullWidth
            multiline
            onChange={(event: ChangeEvent<HTMLInputElement>) => props.onChange({
                ...props.state,
                comment: event.target.value,
            })}
            className={props.classes.field}
        />
    </div>;
}

export default withStyles(styles)(CreateVersionDialog);

// @internal
export function calculateNextVersion(currentVersion: string): { [versionType: string]: string } {
    const parts = currentVersion.split(".").map((s) => parseInt(s, 10));

    return {
        [VersionPanelCreateVersionType.MINOR]: parts[0] + "." + (parts[1] + 1),
        [VersionPanelCreateVersionType.MAJOR]: (parts[0] + 1) + "." + parts[1],
    };
}
