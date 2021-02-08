import React, { useEffect } from "react";
import ResizableChip from "./ResizableChip";

export default {
    title: "searchbar/chips/ResizableChip",
    component: ResizableChip,
};

export const normal = () => <ResizableChip label="abc" />;

export const oversized = () => <ResizableChip label={<span style={{ fontSize: 120 }}>abc</span>} />;

export const changingHeight = () => {
    const [size, setSize] = React.useState(40);

    useEffect(() => {
        const timeoutId = setInterval(() => {
            setSize(Math.random() * 400 + 40);
        }, 1000);
        return () => clearInterval(timeoutId);
    });
    return <ResizableChip label={<span style={{fontSize: size}}>abc</span>} />;
};

changingHeight.parameters = {
    storyshots: {
        disable: true,
    },
};
