/** @type {import('tailwindcss').Config} */
const { addDynamicIconSelectors } = require("@iconify/tailwind");
module.exports = {
  content: [
    "./templates/**/*.html",
    "./templates/modules/layouts/**/*.html",
    "./templates/modules/common/**/*.html",
    "./templates/modules/posts/**/*.html",
    "./templates/modules/widgets/**/*.html",
    "./templates/modules/components/**/*.html",
    "./src/main.ts"
  ],
  theme: {
    extend: {
      colors: {
        // Layui 主题色
        "layui-primary": "#16baaa", // 蓝绿色 - 主色调
        "layui-blue": "#1e9fff", // 经典蓝
        "layui-green": "#16b777", // 清新绿
        "layui-danger": "#ff5722", // 错误/危险
        "layui-warning": "#ffb800", // 警示
        "layui-success": "#16b777", // 成功
        "layui-info": "#31bdec", // 引导/信息
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    // Iconify plugin for dynamic selectors
    // 使用格式: <span class="i-[tabler--menu-2]"></span>
    // 自动从 @iconify/json 加载所有图标集
    // 注意：prefix 值不应该包含末尾的 "-"，类名会自动添加 "-"
    addDynamicIconSelectors({
      prefix: "i",
      iconSets: {
        tabler: require("@iconify-json/tabler").icons,
        bx: require("@iconify-json/bx").icons
      },
    }),
  ],
  safelist: [
    "prose-sm",
    "prose-base",
    "prose-lg",
    "prose-xl",
    "prose-2xl",
    "prose-gray",
    "prose-slate",
    "prose-zinc",
    "prose-neutral",
    "prose-stone",
    // 确保响应式类被包含
    {pattern: /^(?:sm|md|lg|xl|2xl):(hidden|block)$/}
  ],
};
