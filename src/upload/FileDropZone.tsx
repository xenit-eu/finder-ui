import React from "react";
import { useDropzone } from "react-dropzone";

type FileDropZone_Props_t = {
    onFilesDropped?: (file: readonly File[]) => void,
    children: (isDragging: boolean) => React.ReactElement;
} & React.HTMLAttributes<HTMLDivElement>;

export default function FileDropZone({ onFilesDropped, children, ...rest }: FileDropZone_Props_t) {

    const { getRootProps, isDragActive } = useDropzone({
        onDrop: onFilesDropped,
        noClick: true,
        disabled: !onFilesDropped,
    });

    const props = onFilesDropped ? getRootProps({
        children: children(isDragActive),
        ...rest,
    }) : {
            children: children(false),
            ...rest,
        };

    return <div {...props} />;

}
