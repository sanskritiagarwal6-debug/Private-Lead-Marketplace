"use client";

import { useEffect } from "react";

export default function CopyProtection() {
    useEffect(() => {
        // Disable Right Click
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        // Disable specific keyboard shortcuts (like Cmd+C, Cmd+U, Cmd+I) - Optional/Aggressive
        // Keeping it simple to just right click and selection as requested

        document.addEventListener('contextmenu', handleContextMenu);

        // Console Message
        console.log(
            "%c STOP! \n%c This code is the property of Sanskriti Agarwal. Unauthorized copying is prohibited.",
            "color: red; font-size: 50px; font-weight: bold; text-shadow: 2px 2px 0px black;",
            "font-size: 16px; font-family: monospace; color: white; background: red; padding: 10px; border-radius: 5px;"
        );

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    }, []);

    return (
        <style jsx global>{`
            body {
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
            }
            /* Allow selection in inputs and textareas */
            input, textarea {
                user-select: text;
                -webkit-user-select: text;
            }
        `}</style>
    );
}
