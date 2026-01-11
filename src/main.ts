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

// 调试面板
import { 
  initBannerDebugPanel,
  incrementWheelEventCount,
  updateBannerLastWheelTime,
  showBannerDebugInfo
} from "./modules/debug/banner-debug";

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

  // 调试面板初始化
  initBannerDebugPanel();

  // 鼠标滚动事件监听 - 实时更新调试信息
  initBannerWheelListener();
});

/**
 * 初始化 Banner 鼠标滚动事件监听器
 * 用于实时更新调试信息和触发相关功能
 */
function initBannerWheelListener(): void {
  const banners = document.querySelectorAll(".aurora-top-banner") as NodeListOf<HTMLElement>;
  if (banners.length === 0) return;

  const handleWheel = () => {
    const now = Date.now();
    
    // 只更新调试信息，不干扰实际的滚动处理
    // 实际的滚动跳转逻辑在 fullscreen-effect.ts 中处理
    incrementWheelEventCount();
    updateBannerLastWheelTime(now);
    showBannerDebugInfo();
  };

  // 使用 passive: true，不阻止默认行为，只用于调试信息更新
  document.addEventListener("wheel", handleWheel as EventListener, { passive: true });
  console.log("[Banner Wheel] 鼠标滚动事件监听器已初始化（仅用于调试）");
}

// 导出到 window 对象
window.main = main;

// 启动 Alpine.js
Alpine.start();

export default main;
