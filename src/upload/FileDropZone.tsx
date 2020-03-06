import * as React from "react";
import { useState } from "react";

type FileDropZone_Props_t = {
    onFilesDropped: (file: readonly File[]) => void,
    children: (isDragging: boolean) => React.ReactElement;
} & React.HTMLAttributes<HTMLDivElement>;

export default function FileDropZone(props: FileDropZone_Props_t) {
    const { onFilesDropped, children, ...rest } = props;

    const [isDragging, setDragging] = useState(false);

    function onDrop(event: React.DragEvent) {
        event.dataTransfer.effectAllowed = "copy";
        event.dataTransfer.dropEffect = "copy";
        event.preventDefault();
        event.stopPropagation();
        const files: File[] = new Array(event.dataTransfer.files.length);
        for (let i = 0; i < event.dataTransfer.files.length; i++) {
            files[i] = event.dataTransfer.files[i];
        }
        onFilesDropped(files);
        setDragging(false);
    }

    function onDragOver(event: React.DragEvent) {
        setDragging(true);
        event.dataTransfer.effectAllowed = "copy";
        event.dataTransfer.dropEffect = "copy";
        event.preventDefault();
    }

    function onDragLeave(event: React.DragEvent) {
        setDragging(false);
    }

    return <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        children={children(isDragging)}
        aria-dropeffect="copy"
        {...rest}
    />;

}
