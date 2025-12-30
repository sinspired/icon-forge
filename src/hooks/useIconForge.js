import { useState } from "react";
import { APP_DEFAULTS } from "@/core/config";

export function useIconForge(t) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isSvg, setIsSvg] = useState(true);
    const [loading, setLoading] = useState(false);
    const [resultHtml, setResultHtml] = useState(null);
    
    // 初始化配置
    const [config, setConfig] = useState({
        name: APP_DEFAULTS.name,
        shortName: APP_DEFAULTS.shortName,
        brand: APP_DEFAULTS.brand,
        bg: APP_DEFAULTS.bg,
        fg: APP_DEFAULTS.fg,
        goldenRatio: APP_DEFAULTS.goldenRatio 
    });

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
            setResultHtml(null);

            // 检测 SVG 类型
            const isSvgType =
                selected.type.includes('svg') ||
                selected.name.toLowerCase().endsWith('.svg');

            setIsSvg(isSvgType);

            // 如果是位图，自动将图标颜色模式设为 'original'
            if (!isSvgType) {
                setConfig(prev => ({ ...prev, fg: 'original' }));
            }
        }
    };

    // === 修改点 1: 动态生成 HTML 片段 ===
    const generateHtmlSnippet = () => {
        // 使用数组 + filter 过滤掉不需要的行
        const lines = [
            `<!-- PWA & Icons -->`,
            `<meta name="theme-color" content="${config.brand}" media="(prefers-color-scheme: light)">`,
            `<meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)">`,
            ``,
            `<!-- Favicon -->`,
            // 只有 SVG 才生成 ico 和 svg 标签
            isSvg ? `<link rel="icon" href="/favicon.ico" sizes="any">` : null,
            isSvg ? `<link rel="icon" type="image/svg+xml" href="/favicon.svg">` : null,
            // PNG 版本始终保留作为 fallback
            `<link rel="icon" type="image/png" href="/icons/icon-32.png" sizes="32x32">`,
            ``,
            `<!-- Mobile App -->`,
            `<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">`,
            `<link rel="manifest" href="/manifest.json">`
        ];

        // 移除 null 项并用换行符连接
        return lines.filter(line => line !== null).join('\n');
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
        formData.append("goldenRatio", config.goldenRatio);

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

            // 生成预览代码
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
            fg: APP_DEFAULTS.fg,
            goldenRatio: APP_DEFAULTS.goldenRatio // 补全重置
        });
    };

    return {
        file, preview, loading, resultHtml, config, isSvg,
        setConfig, handleFileChange, handleSubmit, resetAll
    };
}