import { withStyles, WithStyles } from "@material-ui/core/styles";
import classnames from "classnames";
import * as React from "react";

export type UploadButton_Props_t = {
    multiple?: boolean,
    onFilesSelected: (files: readonly File[]) => void,
    children: React.ReactNode,
} & React.HTMLAttributes<HTMLDivElement>;

const styles = {
    root: {
        cursor: "pointer",

    },
    fileInput: {
        display: "none",

    },
};
function UploadButton({ onFilesSelected, classes, children, multiple = true, ...props }: UploadButton_Props_t & WithStyles<typeof styles>) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        onFilesSelected(Array.prototype.slice.call(event.target.files));
    }

    function onDivClick(event: React.MouseEvent<HTMLDivElement>) {
        if (inputRef.current) {
            inputRef.current.click();
        }
        if (props.onClick) {
            props.onClick(event);
        }
    }

    return <div {...props} onClick={onDivClick} className={classnames(props.className, classes.root)}>
        <input ref={inputRef} type="file" multiple={multiple} onChange={onChange} className={classes.fileInput} />
        {children}
    </div>;
}

export default withStyles(styles)(UploadButton);
