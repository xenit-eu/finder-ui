import { Theme, WithStyles, withStyles } from "@material-ui/core/styles";
import type { CSSProperties } from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import Overlay, { OverlayCentered } from "../overlay";
import { FileDropZone } from "../upload";
import LargeIcon from "../util/LargeIcon";
import { CreateVersionFab } from "./CreateVersion";
import type { IVersion } from "./Version";
import Version from "./Version";
export interface IVersionPanelVersion extends IVersion {

}

type VersionPanel_Props_t<T extends IVersionPanelVersion> = {
    readonly versions: readonly T[],
    readonly selectedVersion?: T,
    readonly onVersionClick?: (version: T) => void,
    readonly onDownload?: (version: T) => void,
    readonly onDetails?: (version: T) => void,
    readonly onRevert?: (version: T) => void,
    readonly onCreateVersion?: (file?: File) => void,
} & WithStyles<typeof styles>;

const styles = (theme: Theme) => ({
    versionItem: {
        marginTop: theme.spacing.unit / 2,
        marginBottom: theme.spacing.unit / 2,
    },
    newVersionFab: {
        position: "fixed",
        bottom: theme.spacing.unit,
        right: theme.spacing.unit,

    } as CSSProperties,
});

function VersionPanel<T extends IVersionPanelVersion>(props: VersionPanel_Props_t<T>) {
    if (props.versions.length === 0) {
        return <VersionPanelEmpty />;
    }
    const onFilesDropped = useCallback((files: File[]) => props.onCreateVersion!(files[0]), [props.onCreateVersion]);
    const onCreateVersionClick = useCallback(() => props.onCreateVersion!(), [props.onCreateVersion]);
    return <FileDropZone onFilesDropped={props.onCreateVersion ? onFilesDropped : undefined}>{(isDragging: boolean) =>
        <VersionPanelUploadOverlay open={isDragging}>
            {props.versions.map((version, i) => {
                return <div className={props.classes.versionItem} key={i}>
                    <VersionPanelMemoizedVersion
                        version={version}
                        {...props}
                    />
                </div>;
            })}
            {props.onCreateVersion && <div className={props.classes.newVersionFab}>
                <CreateVersionFab onClick={onCreateVersionClick} />
            </div>}
        </VersionPanelUploadOverlay>
    }</FileDropZone>;
}

export default withStyles(styles, { name: "FinderVersionPanel" })(VersionPanel);

/**
 * This component is split out, because calling hooks in a condition is not allowed.
 * We only want to use the `useTranslation()` hook when we need it here, to avoid unnecessarily triggering a Suspense
 */
function VersionPanelEmpty() {
    const { t } = useTranslation("finder-ui");
    return <Typography variant="subheading">{t("versions/VersionPanel/empty-list")}</Typography>;
}

type VersionPanelMemoizedVersion_Props_t<T extends IVersionPanelVersion> = VersionPanel_Props_t<T> & {
    version: T,
};
/**
 * This component is split out, because calling hooks in a loop is not allowed.
 * We still want to use the `useCallback()` hook to reduce the number of rerenders because of new callbacks being created
 */
function VersionPanelMemoizedVersion<T extends IVersionPanelVersion>(props: VersionPanelMemoizedVersion_Props_t<T>) {
    const onVersionClick = useCallback(() => props.onVersionClick!(props.version), [props.onVersionClick, props.version]);
    const onDownload = useCallback(() => props.onDownload!(props.version), [props.onDownload, props.version]);
    const onDetails = useCallback(() => props.onDetails!(props.version), [props.onDetails, props.version]);
    const onRevert = useCallback(() => props.onRevert!(props.version), [props.onRevert, props.version]);
    const isLatestVersion = props.version === props.versions[0];
    const isSelectedVersion = props.version === props.selectedVersion;
    return <Version
        version={props.version}
        latest={isLatestVersion}
        selected={isSelectedVersion}
        onClick={!props.onVersionClick ? undefined : onVersionClick}
        onDownload={isLatestVersion || !props.onDownload ? undefined : onDownload}
        onDetails={!props.onDetails ? undefined : onDetails}
        onRevert={isLatestVersion || !props.onRevert ? undefined : onRevert}
    />;

}

type VersionPanelUploadOverlay_Props_t = {
    open: boolean,
    children: React.ReactNode,
};
function VersionPanelUploadOverlay(props: VersionPanelUploadOverlay_Props_t) {
    const { t } = useTranslation("finder-ui");
    return <Overlay {...props}
        overlay={<OverlayCentered>
            <OverlayCentered>
                <LargeIcon>
                    <CloudUploadIcon />
                </LargeIcon>
            </OverlayCentered>
            <Typography variant="subheading" color="inherit">{t("versions/VersionPanel/drop-to-upload")}</Typography>
        </OverlayCentered>}
    />;
}
