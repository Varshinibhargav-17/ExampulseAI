// src/components/LoadingSpinner.jsx
import React from "react";

export default function LoadingSpinner({ size = "md", text = "" }) {
    const sizeClasses = {
        sm: "spinner-sm",
        md: "",
        lg: "w-16 h-16"
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4 py-12">
            <div className={`spinner ${sizeClasses[size]}`}></div>
            {text && <p className="text-gray-400 text-sm">{text}</p>}
        </div>
    );
}
