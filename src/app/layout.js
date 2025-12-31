// src/app/layout.js

import "./globals.css"; // 引入全局 CSS

// Viewport 配置 (处理 theme-color)
export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  // initialScale: 1,
  // width: 'device-width',
};

// Metadata 配置 - PWA 和 SEO
export const metadata = {
  // 基础 SEO (通用标题和描述)
  title: "Icon Forge - PWA 图标生成器", // 主标题
  description: "为您的 PWA 和 Web 应用一键生成生产级图标。支持 SVG、PNG、JPG 格式，自动生成 Favicon、Android 和 iOS 图标。",
  
  // 关键词 (SEO 优化)
  keywords: ["PWA", "Icon Generator", "Favicon", "Android Icon", "iOS Icon", "Web Development Tools", "PWA图标", "图标生成", "网站图标", "跨平台应用", "工具"],
  
  // 作者信息
  authors: [{ name: "sinspired", url: "https://github.com/sinspired/icon-forge" }], 

  // PWA Manifest 链接
  manifest: '/manifest.json', 

  // 图标配置 (对应 HTML <link rel="icon"> 等标签)
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },           // <link rel="icon" href="/favicon.ico" sizes="any">
      { url: '/favicon.svg', type: 'image/svg+xml' }, // <link rel="icon" type="image/svg+xml" href="/favicon.svg">
      { url: '/icons/icon-32.png', type: 'image/png', sizes: '32x32' }, // <link rel="icon" type="image/png" href="/icons/icon-32.png" sizes="32x32">
      { url: '/icons/icon-16.png', type: 'image/png', sizes: '16x16' }, 
    ],
    // Apple Touch Icon
    apple: [
      { url: '/icons/apple-touch-icon.png' },          // <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
    ],
    // Safari Pinned Tab Icon (通常是纯色 SVG)
    safariPinnedTab: {
      url: '/favicon.svg',
      color: '#ffffff',
    },
  },

  // Open Graph (社交媒体分享优化)
  openGraph: {
    title: "Icon Forge - PWA 图标生成器",
    description: "为您的 PWA 和 Web 应用一键生成生产级图标。",
    url: "https://icon-forge-two.vercel.app", // 网站实际部署地址
    siteName: "Icon Forge",
    images: [
      {
        url: 'https://icon-forge-two.vercel.app/Icon-Forge_OG.png', 
        width: 1200,
        height: 630,
        alt: 'Icon Forge PWA Icon Generator',
      },
    ],
    locale: 'zh_CN', // 如果是主语言
    type: 'website',
  },

  // Twitter Card (Twitter 分享优化)
  twitter: {
    card: 'summary_large_image',
    title: 'Icon Forge - PWA Icon Generator',
    description: '为您的 PWA 和 Web 应用一键生成生产级图标。',
    creator: '@SinspireX', // Twitter 账号
    images: ['https://icon-forge-two.vercel.app/Icon-Forge_OG.png'], // 同 Open Graph 图片
  },

  // 多语言设置 (用于搜索引擎的 Hreflang)
  // 告诉搜索引擎有其他语言版本 (如果将来做多语言路由)
  // alternates: {
  //   canonical: 'https://your-domain.com',
  //   languages: {
  //     'en-US': 'https://your-domain.com/en',
  //     'zh-CN': 'https://your-domain.com/zh',
  //   },
  // },
};

// 默认的根布局组件
export default function RootLayout({ children }) {
  return (
    // 'lang="zh"' 设置页面的主语言
    <html lang="zh" suppressHydrationWarning>
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}