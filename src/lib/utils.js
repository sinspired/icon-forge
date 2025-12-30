/**
 * 格式化颜色为 HTML Input 识别的 7 位 Hex
 */
export const toInputColor = (hex) => {
    if (!hex) return "#000000";
    if (hex.length > 7 && hex.startsWith("#")) return hex.slice(0, 7);
    return hex;
};

/**
 * 带有正则的 HTML 语法高亮逻辑
 */
export const highlightHtml = (html) => {
    if (!html) return "";
    return html
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/(&lt;!--.*?--&gt;)/g, '<span class="text-zinc-400 dark:text-zinc-500 italic">$1</span>')
        .replace(/&lt;([a-z-]+)/g, '&lt;<span class="text-rose-600 dark:text-rose-400">$1</span>')
        .replace(/&lt;\/([a-z-]+)/g, '&lt;/<span class="text-rose-600 dark:text-rose-400">$1</span>')
        .replace(/ ([a-z-]+)=/g, ' <span class="text-indigo-600 dark:text-indigo-400">$1</span>=')
        .replace(/"(.*?)"/g, '"<span class="text-emerald-600 dark:text-emerald-400">$1</span>"');
};