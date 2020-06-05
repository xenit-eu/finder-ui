import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { OverflowMenu } from "../menu";
import { OverlayCentered } from "../overlay";
import LargeIcon from "../util/LargeIcon";
import FolderBreadcrumbs from "./FolderBreadcrumbs";
import FolderList from "./FolderList";
import { IExplorerFolder, IExplorerListFolder } from "./types";

type FolderBrowser_Props_t<PathFolder extends IExplorerFolder, ListFolder extends IExplorerListFolder> = {
    path: readonly PathFolder[],
    onOpen: (folder: PathFolder | ListFolder) => void,
    onSelect: (folder: PathFolder | ListFolder) => void,
    folders: readonly ListFolder[] | null,
};

export default function FolderBrowser<PathFolder extends IExplorerFolder, ListFolder extends IExplorerListFolder>(props: FolderBrowser_Props_t<PathFolder, ListFolder>) {
    const { t } = useTranslation("finder-ui");
    return <>
        <FolderBreadcrumbs
            folders={props.path}
            onClick={props.onOpen}
        />
        {!props.folders ? <OverlayCentered><CircularProgress /></OverlayCentered> :
            props.folders.length > 0 ? <FolderList
                folders={props.folders}
                onClick={props.onOpen as ((folder: ListFolder) => void)}
                folderActions={(folder) => <OverflowMenu
                    items={[
                        {
                            icon: folder.selected ? <RadioButtonCheckedIcon /> : <RadioButtonUncheckedIcon />,
                            label: t("explorer/FolderBrowser/select-folder"),
                            onClick: () => props.onSelect(folder),
                        },
                    ]}
                    maxItems={1}
                />}
            /> : <FolderBrowserEmpty {...props} />}
    </>;

}

function FolderBrowserEmpty<PF extends IExplorerFolder, LF extends IExplorerListFolder>(props: FolderBrowser_Props_t<PF, LF>) {
    const onClick = useCallback(() => props.onSelect(props.path[props.path.length - 1]), [props.onSelect, props.path[props.path.length - 1]]);
    const { t } = useTranslation("finder-ui");
    return <OverlayCentered>
        <OverlayCentered>
            <LargeIcon>
                <FolderOpenIcon />
            </LargeIcon>
        </OverlayCentered>
        <OverlayCentered>
            <Typography paragraph>{t("explorer/FolderBrowser/empty-list")}</Typography>
        </OverlayCentered>
        <OverlayCentered>
            <Button
                variant="contained"
                color="primary"
                onClick={onClick}
            >{t("explorer/FolderBrowser/select-current-folder")}</Button>
        </OverlayCentered>
    </OverlayCentered>;

}
