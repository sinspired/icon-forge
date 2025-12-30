export const toInputColor = (hex) => {
  if (!hex) return "#000000";
  return hex.length > 7 && hex.startsWith("#") ? hex.slice(0, 7) : hex;
};

export const highlightHtml = (html) => {
  if (!html) return "";

  // 进行基础转义，防止浏览器解析
  const escaped = html.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const regex = /(&lt;!--.*?--&gt;)|(&lt;\/?[a-z1-6]+)|(\s[a-z-]+)(?==)|="([^"]*)"/g;

  return escaped.replace(regex, (match, comment, tag, attr, value) => {
    // 处理注释
    if (comment) {
      return `<span class="text-zinc-400 dark:text-zinc-500 italic">${comment}</span>`;
    }
    
    // 处理标签名 (如 &lt;meta)
    if (tag) {
      const isClosing = tag.includes('/');
      const tagName = tag.replace('&lt;', '').replace('/', '');
      return `&lt;${isClosing ? '/' : ''}<span class="text-rose-600 dark:text-rose-400">${tagName}</span>`;
    }
    
    // 处理属性名 (必须是空格开头且后面跟着等号)
    if (attr) {
      return ` <span class="text-indigo-600 dark:text-indigo-400">${attr.trim()}</span>`;
    }
    
    // 处理属性值 (引号内的内容)
    if (value !== undefined) {
      return `="<span class="text-emerald-600 dark:text-emerald-400">${value}</span>"`;
    }

    return match;
  });
};