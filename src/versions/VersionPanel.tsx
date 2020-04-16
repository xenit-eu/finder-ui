import { Theme, WithStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
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
} & WithStyles<typeof styles>;

const styles = (theme: Theme) => ({
    versionItem: {
        marginTop: theme.spacing.unit / 2,
        marginBottom: theme.spacing.unit / 2,
    },
});

function VersionPanel<T extends IVersionPanelVersion>(props: VersionPanel_Props_t<T>) {
    if (props.versions.length === 0) {
        const { t } = useTranslation("finder-ui");
        return <Typography variant="subheading">{t("versions/VersionPanel/empty-list")}</Typography>;
    }
    const latestVersion = props.versions[0];
    const selectedVersion = props.selectedVersion;
    return <div>
        {props.versions.map((version, i) => {
            const onVersionClick = useCallback(() => props.onVersionClick!(version), [props.onVersionClick, version]);
            const onDownload = useCallback(() => props.onDownload!(version), [props.onDownload, version]);
            const onDetails = useCallback(() => props.onDetails!(version), [props.onDetails, version]);
            const onRevert = useCallback(() => props.onRevert!(version), [props.onRevert, version]);
            return <div className={props.classes.versionItem} key={i}>
                <Version
                    version={version}
                    latest={version === latestVersion}
                    selected={version === selectedVersion}
                    onClick={!props.onVersionClick ? undefined : onVersionClick}
                    onDownload={version === latestVersion || !props.onDownload ? undefined : onDownload}
                    onDetails={!props.onDetails ? undefined : onDetails}
                    onRevert={version === latestVersion || !props.onRevert ? undefined : onRevert}
                />
            </div>;
        })}
    </div>;
}

export default withStyles(styles, { name: "FinderVersionPanel" })(VersionPanel);
