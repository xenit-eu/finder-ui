import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import * as React from "react";
import { useTranslation } from "react-i18next";

type CreateVersionFab_Props_t = {
    onClick: () => void,
};

export default function CreateVersionFab(props: CreateVersionFab_Props_t) {
    const { t } = useTranslation("finder-ui");
    return <Button
        color="primary"
        variant="fab"
        aria-label={t("versions/CreateVersion/create")}
        onClick={props.onClick}
    >
        <AddIcon />
    </Button>;
}
