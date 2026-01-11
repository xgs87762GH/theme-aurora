/**
 * Banner 初始化和管理
 */
import { initFullScreenBannerEffect } from "./fullscreen-effect";
import { initBannerBackgroundStrategy, GlobalBackgroundStrategy } from "./strategies";
import { initBannerCarousel } from "./carousel";
import { initBannerPostsHide } from "./posts-hide";

export function initBanner(): void {
  console.log("[Banner Debug] 开始初始化 Banner");
  
  // 查找所有 Banner 元素（根据 home-layout.html 的结构）
  const banners = document.querySelectorAll(".aurora-top-banner") as NodeListOf<HTMLElement>;
  console.log("[Banner Debug] 找到 Banner 数量:", banners.length);
  
  if (banners.length === 0) {
    console.warn("[Banner Debug] 警告：未找到任何 Banner 元素");
    // 即使没有 Banner 元素，如果启用全局背景，也要尝试从 localStorage 读取并应用
    GlobalBackgroundStrategy.applyFromStorage();
    return;
  }

  banners.forEach((banner, index) => {
    console.log(`[Banner Debug] 处理 Banner #${index + 1}:`, banner);
    
    // 读取 Banner 配置（从 data 属性）
    const isFullScreen = banner.getAttribute("data-full-screen") === "true";
    const useGlobalBg = banner.getAttribute("data-use-global-bg") === "true";
    
    console.log(`[Banner Debug] Banner #${index + 1} 配置:`, {
      isFullScreen,
      useGlobalBg,
      "data-full-screen": banner.getAttribute("data-full-screen"),
      "data-use-global-bg": banner.getAttribute("data-use-global-bg")
    });

    // 全屏 Banner 的特殊处理
    // 即使使用全局背景，滚动指示器也应该工作（但不应用放大和固定效果）
    if (isFullScreen) {
      console.log(`[Banner Debug] Banner #${index + 1} 需要初始化全屏效果`);
      initFullScreenBannerEffect(banner, useGlobalBg);
    } else {
      console.log(`[Banner Debug] Banner #${index + 1} 跳过全屏效果初始化: 不是全屏 Banner`);
    }

    // Banner 背景策略（所有 Banner 都需要）
    initBannerBackgroundStrategy(banner, isFullScreen, useGlobalBg);
  });

  // Banner 轮播初始化
  initBannerCarousel();

  // Banner 中的文章隐藏处理
  initBannerPostsHide();
  
  console.log("[Banner Debug] Banner 初始化完成");
}

