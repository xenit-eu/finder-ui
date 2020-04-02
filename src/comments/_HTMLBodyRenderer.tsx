import { sanitize } from "dompurify";
import * as React from "react";

export default function HTMLBodyRenderer({ children }: { children: React.ReactNode }) {
    return <>
        {React.Children.map(children, (body) => {
            if (typeof body === "string") {
                const sanitizedBody = sanitize(body);
                return <div dangerouslySetInnerHTML={{ __html: sanitizedBody }} />;
            }
            return body;
        })}
    </>;
}
