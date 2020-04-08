import { Button, Zoom } from "@material-ui/core";
import AddCommentIcon from "@material-ui/icons/AddComment";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { NewComment_Props_t } from "./NewComment";

export default function NewCommentFab(props: NewComment_Props_t) {
    const { t } = useTranslation("finder-ui");
    return <Zoom
        in={!props.isEditing}
        appear={false}
    >
        <Button
            color="primary"
            variant="fab"
            aria-label={t("comments/NewComment/create")}
            onClick={props.onCreate}
        >
            <AddCommentIcon />
        </Button>
    </Zoom>;
}
