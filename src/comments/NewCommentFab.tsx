import { Button } from "@material-ui/core";
import AddCommentIcon from "@material-ui/icons/AddComment";
import * as React from "react";
import { useTranslation } from "react-i18next";

type NewCommentFab_Props_t = {
    onCreate: () => void,
};

export default function NewCommentFab(props: NewCommentFab_Props_t) {
    const { t } = useTranslation("finder-ui");
    return <Button
        color="primary"
        variant="fab"
        aria-label={t("comments/NewComment/create")}
        onClick={props.onCreate}
    >
        <AddCommentIcon />
    </Button>;
}
