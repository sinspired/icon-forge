// 配置定义

export const APP_DEFAULTS = {
  // 应用元数据
  name: "My App",
  shortName: "App",
  
  // 颜色配置
  brand: "#0071e3",    // 品牌色 (Azure Blue)

  // 颜色配置
  // 1. 如果设置为 'original' 或 null，则保留 SVG 的原始颜色
  // 2. 如果设置为 hex 值 (如 #ffffff)，则会对 SVG 进行单色着色 (Tint)
  fg: "#ffffff", // 建议默认为 original，或者根据你的品牌需求设为 #ffffff

  // 1. 如果设置为 'transparent' 或 null，则背景透明
  // 2. 如果设置为 hex 值 (如 #444546)，则添加实色背景
  bg: "#000000", 
  
  // 生成参数
  goldenRatio: 0.65,   // Maskable 图标的安全区缩放比例
};