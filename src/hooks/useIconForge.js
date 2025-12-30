import { useState } from "react";
import { APP_DEFAULTS } from "@/core/config";

export function useIconForge(t) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [resultHtml, setResultHtml] = useState(null);
    const [config, setConfig] = useState({
        name: APP_DEFAULTS.name,
        shortName: APP_DEFAULTS.shortName,
        brand: APP_DEFAULTS.brand,
        bg: APP_DEFAULTS.bg,
        fg: APP_DEFAULTS.fg
    });

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
            setResultHtml(null);
        }
    };

    const generateHtmlSnippet = () => {
        return `<!-- PWA & Icons -->
<meta name="theme-color" content="${config.brand}">

<!-- Favicon -->
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" href="/icons/icon-32.png" sizes="32x32">

<!-- Mobile App -->
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
<link rel="manifest" href="/manifest.json">`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("name", config.name);
        formData.append("short_name", config.shortName);
        formData.append("brand", config.brand);
        formData.append("bg", config.bg);
        formData.append("fg", config.fg);

        try {
            const res = await fetch("/api/generate", { method: "POST", body: formData });
            if (!res.ok) throw new Error(t.error);

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${config.shortName.replace(/\s+/g, '-').toLowerCase()}-icons.zip`;
            document.body.appendChild(a);
            a.click();
            a.remove();

            setResultHtml(generateHtmlSnippet());
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const resetAll = () => {
        setFile(null);
        setPreview(null);
        setResultHtml(null);
        setConfig({
            name: APP_DEFAULTS.name,
            shortName: APP_DEFAULTS.shortName,
            brand: APP_DEFAULTS.brand,
            bg: APP_DEFAULTS.bg,
            fg: APP_DEFAULTS.fg
        });
    };

    return {
        file, preview, loading, resultHtml, config,
        setConfig, handleFileChange, handleSubmit, resetAll
    };
}