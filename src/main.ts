// 样式导入
import "./styles/main.css";
import "./styles/tailwind.css";
import "./styles/layout.css";
import "./styles/components.css";
import "./styles/utilities.css";

// Alpine.js 初始化
import Alpine from "alpinejs";
window.Alpine = Alpine;

// Alpine.js 组件
import "./alpine";

// 核心功能
import { main } from "./core/main";

// UI 组件
import { initScrollToTopButton, setActiveMenuItems } from "./modules/ui";

// Banner 功能
import { initBanner } from "./modules/banner";

// 工具函数（导出到 window）
import "./utils/mouse-wheel-listener";

// DOM 加载完成后初始化
document.addEventListener("DOMContentLoaded", () => {
  // 设置导航栏 active 状态
  setActiveMenuItems();
  
  // 滚动到顶部按钮
  initScrollToTopButton();

  // Banner 初始化
  initBanner();
});

// 导出到 window 对象
window.main = main;

// 启动 Alpine.js
Alpine.start();

export default main;
