/**
 * Banner 调试面板
 */

// 全局变量，用于调试面板显示
export let wheelEventCount = 0;
export let lastWheelTime = 0;
export let clickEventCount = 0;
export let lastClickTime = 0;

// 导出更新函数，供其他模块使用
export function updateBannerLastWheelTime(time: number): void {
  lastWheelTime = time;
}

export function incrementWheelEventCount(): void {
  wheelEventCount++;
}

export function incrementClickEventCount(): void {
  clickEventCount++;
}

export function updateBannerLastClickTime(time: number): void {
  lastClickTime = time;
}

// export function showBannerDebugInfo(): void {
//   const banners = document.querySelectorAll(".aurora-top-banner") as NodeListOf<HTMLElement>;
//   if (banners.length === 0) return;

//   // 创建调试面板容器
//   let debugPanel = document.getElementById("banner-debug-panel");
//   if (!debugPanel) {
//     debugPanel = document.createElement("div");
//     debugPanel.id = "banner-debug-panel";
//     debugPanel.style.cssText = "position: fixed; top: 10px; right: 10px; background: #fef3c7; border: 2px solid #f59e0b; padding: 1rem; border-radius: 0.5rem; font-family: monospace; font-size: 0.75rem; max-width: 400px; max-height: 80vh; overflow-y: auto; z-index: 9999; box-shadow: 0 4px 6px rgba(0,0,0,0.1);";
//     document.body.appendChild(debugPanel);
//   }

//   let html = '<div style="font-weight: bold; margin-bottom: 0.5rem; color: #92400e;">Banner 调试信息</div>';
  
//   banners.forEach((banner, index) => {
//     const isFullScreen = banner.getAttribute("data-full-screen") === "true";
//     const useGlobalBg = banner.getAttribute("data-use-global-bg") === "true";
//     const scrollIndicator = banner.querySelector(".aurora-scroll-indicator") as HTMLElement;
//     const scrollDownBtn = banner.querySelector(".aurora-scroll-down-btn") as HTMLElement;
//     const bannerHeight = banner.offsetHeight;
//     const currentScroll = window.scrollY;
//     const isInBanner = currentScroll < bannerHeight;
//     const timeSinceLastWheel = lastWheelTime > 0 ? (Date.now() - lastWheelTime) + 'ms前' : '从未';
//     const timeSinceLastClick = lastClickTime > 0 ? (Date.now() - lastClickTime) + 'ms前' : '从未';
    
//     // Banner 在视口中的位置信息
//     const bannerRect = banner.getBoundingClientRect();
//     const isBannerVisible = bannerRect.bottom > 0 && bannerRect.top < window.innerHeight;
//     const bannerTop = bannerRect.top.toFixed(1);
//     const bannerBottom = bannerRect.bottom.toFixed(1);
//     const viewportHeight = window.innerHeight;
    
//     // 检查按钮的样式和状态
//     let buttonInfo = '未知';
//     if (scrollDownBtn) {
//       const rect = scrollDownBtn.getBoundingClientRect();
//       const pointerEvents = window.getComputedStyle(scrollDownBtn).pointerEvents;
//       const visibility = window.getComputedStyle(scrollDownBtn).visibility;
//       const display = window.getComputedStyle(scrollDownBtn).display;
//       const opacity = window.getComputedStyle(scrollDownBtn).opacity;
//       const isInViewport = rect.width > 0 && rect.height > 0 && rect.top >= 0 && rect.top < window.innerHeight && rect.left >= 0 && rect.left < window.innerWidth;
//       buttonInfo = `可见:${visibility}, 显示:${display}, 指针:${pointerEvents}, 透明度:${opacity}, 位置:(${rect.left.toFixed(0)},${rect.top.toFixed(0)}), 大小:(${rect.width.toFixed(0)}x${rect.height.toFixed(0)}), 视口内:${isInViewport ? '是' : '否'}`;
//     }
    
//     // 计算Banner可见比例
//     const visibleTop = Math.max(0, bannerRect.top);
//     const visibleBottom = Math.min(viewportHeight, bannerRect.bottom);
//     const visibleHeight = Math.max(0, visibleBottom - visibleTop);
//     const visibleRatio = bannerHeight > 0 ? (visibleHeight / bannerHeight) : 0;

//     html += `<div style="margin-bottom: 1rem; padding: 0.5rem; background: rgba(255,255,255,0.5); border-radius: 0.25rem;">`;
//     html += `<div style="font-weight: bold; color: #92400e; margin-bottom: 0.25rem;">Banner #${index + 1}</div>`;
//     html += `<div style="margin-bottom: 0.125rem;"><span style="font-weight: bold;">全屏:</span> <span style="color: #dc2626;">${isFullScreen}</span></div>`;
//     html += `<div style="margin-bottom: 0.125rem;"><span style="font-weight: bold;">全局背景:</span> <span style="color: #dc2626;">${useGlobalBg}</span></div>`;
//     html += `<div style="margin-bottom: 0.125rem;"><span style="font-weight: bold;">Banner 高度:</span> <span style="color: #dc2626;">${bannerHeight}px</span></div>`;
//     html += `<div style="margin-bottom: 0.125rem;"><span style="font-weight: bold;">当前滚动:</span> <span style="color: #dc2626;">${currentScroll.toFixed(1)}px</span></div>`;
//     html += `<div style="margin-bottom: 0.125rem;"><span style="font-weight: bold;">在Banner内:</span> <span style="color: ${isInBanner ? '#16a34a' : '#dc2626'};">${isInBanner ? '是' : '否'}</span></div>`;
//     html += `<div style="margin-bottom: 0.125rem;"><span style="font-weight: bold;">Banner可见:</span> <span style="color: ${isBannerVisible ? '#16a34a' : '#dc2626'};">${isBannerVisible ? '是' : '否'}</span></div>`;
//     html += `<div style="margin-bottom: 0.125rem;"><span style="font-weight: bold;">Banner位置:</span> <span style="color: #dc2626;">顶部:${bannerTop}px, 底部:${bannerBottom}px</span></div>`;
//     html += `<div style="margin-bottom: 0.125rem;"><span style="font-weight: bold;">视口高度:</span> <span style="color: #dc2626;">${viewportHeight}px</span></div>`;
//     html += `<div style="margin-bottom: 0.125rem;"><span style="font-weight: bold;">Banner可见比例:</span> <span style="color: #dc2626;">${(visibleRatio * 100).toFixed(1)}%</span></div>`;
//     html += `<div style="margin-bottom: 0.125rem;"><span style="font-weight: bold;">滚动指示器:</span> <span style="color: #dc2626;">${scrollIndicator ? '✓' : '✗'}</span></div>`;
//     html += `<div style="margin-bottom: 0.125rem;"><span style="font-weight: bold;">滚动按钮:</span> <span style="color: #dc2626;">${scrollDownBtn ? '✓' : '✗'}</span></div>`;
//     if (scrollIndicator) {
//       const opacity = window.getComputedStyle(scrollIndicator).opacity;
//       const visibility = window.getComputedStyle(scrollIndicator).visibility;
//       const pointerEvents = window.getComputedStyle(scrollIndicator).pointerEvents;
//       html += `<div style="margin-bottom: 0.125rem;"><span style="font-weight: bold;">指示器透明度:</span> <span style="color: #dc2626;">${opacity}</span></div>`;
//       html += `<div style="margin-bottom: 0.125rem;"><span style="font-weight: bold;">指示器可见性:</span> <span style="color: ${visibility === 'visible' ? '#16a34a' : '#dc2626'};">${visibility}</span></div>`;
//       html += `<div style="margin-bottom: 0.125rem;"><span style="font-weight: bold;">指示器指针事件:</span> <span style="color: ${pointerEvents === 'auto' ? '#16a34a' : '#dc2626'};">${pointerEvents}</span></div>`;
//     }
//     html += `<div style="margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid rgba(0,0,0,0.1);">`;
//     html += `<div style="margin-bottom: 0.125rem;"><span style="font-weight: bold;">滚轮事件计数:</span> <span style="color: #dc2626;">${wheelEventCount}</span></div>`;
//     html += `<div style="margin-bottom: 0.125rem;"><span style="font-weight: bold;">最后滚轮时间:</span> <span style="color: #dc2626;">${timeSinceLastWheel}</span></div>`;
//     html += `<div style="margin-bottom: 0.125rem;"><span style="font-weight: bold;">点击事件计数:</span> <span style="color: #dc2626;">${clickEventCount}</span></div>`;
//     html += `<div style="margin-bottom: 0.125rem;"><span style="font-weight: bold;">最后点击时间:</span> <span style="color: #dc2626;">${timeSinceLastClick}</span></div>`;
//     html += `<div style="margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid rgba(0,0,0,0.1); font-size: 0.7rem; word-break: break-all;">`;
//     html += `<div style="margin-bottom: 0.125rem;"><span style="font-weight: bold;">按钮信息:</span></div>`;
//     html += `<div style="color: #dc2626; font-size: 0.65rem;">${buttonInfo}</div>`;
//     html += `</div>`;
//     html += `</div>`;
//     html += `</div>`;
//   });

//   html += '<div style="margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid #f59e0b; font-size: 0.7rem; color: #92400e;">提示：滚动鼠标查看事件触发情况</div>';
  
//   debugPanel.innerHTML = html;
// }

// /**
//  * 初始化调试面板
//  */
// export function initBannerDebugPanel(): void {
//   // 导出更新函数到 window，供其他模块使用
//   (window as any).__updateBannerLastWheelTime = updateBannerLastWheelTime;

//   // 初始化时显示调试信息
//   showBannerDebugInfo();

//   // 滚动时更新调试信息
//   let debugTicking = false;
//   window.addEventListener("scroll", () => {
//     if (!debugTicking) {
//       window.requestAnimationFrame(() => {
//         showBannerDebugInfo();
//         debugTicking = false;
//       });
//       debugTicking = true;
//     }
//   }, { passive: true });
// }

