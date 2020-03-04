import * as React from "react";
import UploadList, { IUploadedFile } from "./UploadList";
import FileDropZone from "./FileDropZone";
import Overlay, { OverlayCentered } from "../overlay";
import CloudUpload from "@material-ui/icons/CloudUpload";
import Edit from "@material-ui/icons/Edit";
import DoneAll from "@material-ui/icons/DoneAll";
import Done from "@material-ui/icons/Done";
import { Theme, WithStyles, withStyles } from "@material-ui/core/styles";
import { Typography, Button, IconButton } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import UploadButton from "./UploadButton";

type UploadPanel_Props_t<T extends IUploadedFile = IUploadedFile> = {
    onUploadAdded: (file: File) => void,
    onUploadCancel: (file: T) => void,
    onUploadEditMetadata: (files: T[]) => void,
    onDoneAll: () => void,
    onUploadDone: (file: T) => void,
    files: readonly T[],
};

export default function UploadPanel<T extends IUploadedFile = IUploadedFile>(props: UploadPanel_Props_t<T>) {
    const { t } = useTranslation("finder-ui");
    function uploadFiles(files: readonly File[]) {
        files.forEach(file => props.onUploadAdded(file));
    }
    return <FileDropZone onFilesDropped={uploadFiles}>
        {(isDragging: boolean) => {
            return <UploadPanelOverlay open={isDragging}>
                {props.files.length > 0 && <UploadPanelGlobalActions onFilesSelected={uploadFiles} onDoneAll={props.onDoneAll} />}
                <UploadList
                    files={props.files}
                    onUploadClick={(file: T) => props.onUploadEditMetadata([file])}
                    onUploadCancel={props.onUploadCancel}
                    placeholder={<EmptyUploadList onFilesSelected={uploadFiles} />}
                    uploadActions={(file: T) => {
                        return <>
                            <IconButton onClick={() => props.onUploadEditMetadata([file])} title={t("upload/UploadPanel/edit-metadata")}>
                                <Edit />
                            </IconButton>
                            <IconButton onClick={() => props.onUploadDone(file)} title={t("upload/UploadPanel/done")}>
                                <Done />
                            </IconButton>
                        </>;
                    }}
                />
            </UploadPanelOverlay>;
        }}
    </FileDropZone>;
}

const largeCloudUploadIconStyles = {
    root: {
        fontSize: 80,
    },
};

const LargeCloudUploadIcon = withStyles(largeCloudUploadIconStyles)(({ classes }) => <span className={classes.root}><CloudUpload fontSize="inherit" /></span>);
function EmptyUploadList(props: UploadPanelUploadButton_Props_t) {
    const { t } = useTranslation("finder-ui");
    return <OverlayCentered>
        <OverlayCentered>
            <LargeCloudUploadIcon />
        </OverlayCentered>
        <OverlayCentered>
            <Typography variant="subheading">{t("upload/UploadPanel/empty-list")}</Typography>
        </OverlayCentered>
        <OverlayCentered>
            <UploadPanelUploadButton {...props} />
        </OverlayCentered>
    </OverlayCentered>;
}

type UploadPanelOverlay_Props_t = {
    open: boolean,
    children: React.ReactNode,
};
function UploadPanelOverlay(props: UploadPanelOverlay_Props_t) {
    const { t } = useTranslation("finder-ui");
    return <Overlay {...props} overlay={
        <OverlayCentered>
            <OverlayCentered>
                <LargeCloudUploadIcon />
            </OverlayCentered>
            <Typography variant="subheading" color="inherit">{t("upload/UploadPanel/drop-to-upload")}</Typography>
        </OverlayCentered>
    } />;
}

const uploadPanelUploadButtonStyle = (theme: Theme) => ({
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
});

type UploadPanelUploadButton_Props_t = {
    onFilesSelected: (files: readonly File[]) => void,
};
const UploadPanelUploadButton = withStyles(uploadPanelUploadButtonStyle)((props: UploadPanelUploadButton_Props_t & WithStyles<typeof uploadPanelUploadButtonStyle>) => {
    const { t } = useTranslation("finder-ui");
    return <UploadButton onFilesSelected={props.onFilesSelected}>
        <Button variant="contained" color="primary">
            <CloudUpload className={props.classes.leftIcon} role="presentation" />
            {t("upload/UploadPanel/upload-button")}
        </Button>
    </UploadButton>;
});

const uploadPanelGlobalActionsStyle = {
    root: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end"
    },
    buttonContainer: {
    }
};

type UploadPanelGlobalActions_Props_t = {
    onFilesSelected: (files: readonly File[]) => void,
    onDoneAll: () => void,
};

const UploadPanelGlobalActions = withStyles(uploadPanelGlobalActionsStyle)((props: UploadPanelGlobalActions_Props_t & WithStyles<typeof uploadPanelGlobalActionsStyle>) => {
    const { t } = useTranslation("finder-ui");
    return <div className={props.classes.root}>
        <div className={props.classes.buttonContainer}>
            <UploadPanelUploadButton onFilesSelected={props.onFilesSelected} />
        </div>
        <div className={props.classes.buttonContainer}>
            <IconButton onClick={() => props.onDoneAll()} title={t("upload/UploadPanel/done-all")}>
                <DoneAll />
            </IconButton>
        </div>
    </div>;
});
