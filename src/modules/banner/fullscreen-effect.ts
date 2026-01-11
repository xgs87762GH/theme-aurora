/**
 * 全屏 Banner 滚动效果（放大、固定、跳转）
 */
import {
  incrementClickEventCount,
  updateBannerLastClickTime,
  showBannerDebugInfo
} from "../debug/banner-debug";
import { initBannerWheelScrollHandler } from "./wheel-scroll-handler";

export function initFullScreenBannerEffect(banner: HTMLElement, useGlobalBg: boolean = false): void {
  console.log("[Banner Debug] 初始化全屏 Banner 效果", banner, "useGlobalBg:", useGlobalBg);
  
  // 检查 Banner 是否满足滚动触发条件
  const isFullScreen = banner.getAttribute("data-full-screen") === "true";
  const initialBannerHeight = banner.offsetHeight;
  const initialViewportHeight = window.innerHeight;
  const minHeightThreshold = initialViewportHeight / 3;
  
  console.log("[Banner Debug] 条件检查 - 全屏:", isFullScreen, "高度:", initialBannerHeight, "视口:", initialViewportHeight, "阈值:", minHeightThreshold);

  // 查找 Banner 内的元素（根据 home-layout.html 的结构）
  const scrollIndicator = banner.querySelector(".aurora-scroll-indicator") as HTMLElement;
  const scrollDownBtn = banner.querySelector(".aurora-scroll-down-btn") as HTMLElement;

  console.log("[Banner Debug] scrollIndicator:", scrollIndicator);
  console.log("[Banner Debug] scrollDownBtn:", scrollDownBtn);

  if (!scrollIndicator) {
    console.warn("[Banner Debug] 警告：未找到滚动指示器元素");
  }
  if (!scrollDownBtn) {
    console.warn("[Banner Debug] 警告：未找到滚动按钮元素");
  }

  let ticking = false;
  let isFixed = false;
  let bannerHeight = initialBannerHeight;
  
  console.log("[Banner Debug] Banner 初始高度:", bannerHeight);

  // 更新 Banner 高度（响应窗口缩放）
  const updateBannerHeight = () => {
    const newHeight = banner.offsetHeight;
    if (newHeight !== bannerHeight) {
      console.log("[Banner Debug] Banner 高度更新:", bannerHeight, "->", newHeight);
      bannerHeight = newHeight;
    }
  };
  window.addEventListener("resize", updateBannerHeight, { passive: true });

  // 滚动到内容区域
  const scrollToContent = () => {
    console.log("[Banner Debug] 滚动到内容区域，目标位置:", bannerHeight);
    window.scrollTo({
      top: bannerHeight,
      behavior: "smooth"
    });
  };


  // 滚动提示按钮点击事件
  if (scrollDownBtn) {
    console.log("[Banner Debug] 绑定滚动按钮点击事件，按钮元素:", scrollDownBtn);
    
    // 测试按钮是否可点击
    console.log("[Banner Debug] 按钮样式:", window.getComputedStyle(scrollDownBtn).pointerEvents);
    console.log("[Banner Debug] 按钮位置:", scrollDownBtn.getBoundingClientRect());
    
    const handleButtonClick = (e: MouseEvent) => {
      incrementClickEventCount();
      updateBannerLastClickTime(Date.now());
      console.log("[Banner Debug] 滚动按钮被点击！", {
        type: e.type,
        target: e.target,
        currentTarget: e.currentTarget,
        button: e.button,
        clientX: e.clientX,
        clientY: e.clientY
      });
      e.preventDefault();
      e.stopPropagation();
      console.log("[Banner Debug] 准备滚动到内容区域，目标位置:", bannerHeight);
      scrollToContent();
      // 更新调试面板
      showBannerDebugInfo();
    };
    
    // 绑定点击事件（使用多个事件类型确保捕获）
    scrollDownBtn.addEventListener("click", handleButtonClick, { capture: true });
    scrollDownBtn.addEventListener("mousedown", (e) => {
      console.log("[Banner Debug] 按钮 mousedown 事件", e);
    });
    scrollDownBtn.addEventListener("mouseup", (e) => {
      console.log("[Banner Debug] 按钮 mouseup 事件", e);
    });
    
    // 也绑定到父容器，防止事件冒泡问题
    if (scrollIndicator) {
      scrollIndicator.addEventListener("click", (e) => {
        console.log("[Banner Debug] 滚动指示器被点击", e);
        // 如果点击的不是按钮本身，也触发滚动
        if (e.target !== scrollDownBtn && !scrollDownBtn.contains(e.target as Node)) {
          console.log("[Banner Debug] 点击在指示器容器上，触发滚动");
          scrollToContent();
        }
      });
    }
  } else {
    console.error("[Banner Debug] 错误：无法绑定滚动按钮事件，元素不存在");
  }

  // 初始化鼠标滚动事件处理器（仅在全屏且高度超过视口 1/3 时生效）
  // 滚动到顶部（Banner 区域）的回调函数
  const scrollToTopCallback = () => {
    console.log("[Banner Debug] 滚动到顶部（回调）");
    // 重置 Banner 状态
    if (isFixed) {
      isFixed = false;
      banner.classList.remove("aurora-banner-fixed");
      const placeholder = document.querySelector(".aurora-banner-placeholder");
      if (placeholder) {
        placeholder.remove();
      }
    }
    // 重置变换
    banner.style.transform = "";
    banner.style.willChange = "";
    // 显示滚动提示按钮
    if (scrollIndicator) {
      scrollIndicator.style.opacity = "1";
      scrollIndicator.style.visibility = "visible";
      scrollIndicator.style.pointerEvents = "auto";
    }
    // 平滑滚动到顶部（使用 smooth 以获得流畅的滚动效果）
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  
  if (isFullScreen && initialBannerHeight > minHeightThreshold) {
    console.log("[Banner Debug] ✓ Banner 满足滚动条件，初始化滚动事件处理器");
    console.log("[Banner Debug] - 全屏:", isFullScreen, "高度:", initialBannerHeight, "视口1/3:", minHeightThreshold.toFixed(1));
    // 初始化滚动事件处理器，传入回调函数和状态管理函数
    initBannerWheelScrollHandler(
      banner,
      isFullScreen,
      useGlobalBg,
      scrollToContent,
      scrollToTopCallback,
      () => isFixed,
      (fixed: boolean) => { isFixed = fixed; }
    );
  } else {
    console.log("[Banner Debug] ✗ Banner 不满足滚动条件，跳过滚动事件处理器初始化");
    console.log("[Banner Debug] - 全屏:", isFullScreen, "高度:", initialBannerHeight, "视口1/3:", minHeightThreshold.toFixed(1));
  }

  // Banner 滚动效果处理（仅在非全局背景模式下应用放大和固定效果）
  const handleBannerEffect = () => {
    if (ticking) return;
    ticking = true;

    window.requestAnimationFrame(() => {
      const scrolled = window.scrollY;
      const currentBannerHeight = banner.offsetHeight;

      // 全局背景模式下，只处理滚动指示器的淡出效果
      if (useGlobalBg) {
        if (scrollIndicator) {
          // 检查 Banner 在视口中的位置
          const bannerRect = banner.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const isBannerVisible = bannerRect.bottom > 0 && bannerRect.top < viewportHeight;
          
          // 计算 Banner 在视口中的可见高度
          const visibleTop = Math.max(0, bannerRect.top);
          const visibleBottom = Math.min(viewportHeight, bannerRect.bottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);
          const visibleRatio = visibleHeight / currentBannerHeight; // Banner可见部分的比例
          
          // 计算透明度：基于Banner在视口中的可见比例
          // 当Banner完全可见时（visibleRatio >= 0.5），按钮完全显示
          // 当Banner部分可见时（visibleRatio < 0.5），按钮逐渐淡出
          let indicatorOpacity = 0;
          if (isBannerVisible && visibleRatio > 0) {
            if (visibleRatio >= 0.5) {
              // Banner至少50%可见，按钮完全显示
              indicatorOpacity = 1;
            } else {
              // Banner少于50%可见，按钮逐渐淡出
              indicatorOpacity = visibleRatio * 2; // 0-0.5 映射到 0-1
            }
          }
          
          // 只有当 Banner 可见且透明度足够时才显示按钮
          if (isBannerVisible && indicatorOpacity >= 0.1) {
            scrollIndicator.style.opacity = indicatorOpacity.toString();
            scrollIndicator.style.visibility = "visible";
            scrollIndicator.style.pointerEvents = "auto";
            scrollIndicator.classList.remove("hidden");
          } else {
            scrollIndicator.style.opacity = "0";
            scrollIndicator.style.visibility = "hidden";
            scrollIndicator.style.pointerEvents = "none";
            scrollIndicator.classList.add("hidden");
          }
          
          if (scrolled % 100 < 10) { // 每100px打印一次，避免日志过多
            console.log("[Banner Debug] 全局背景模式 - scrollY:", scrolled, "Banner可见:", isBannerVisible, "可见比例:", visibleRatio.toFixed(2), "透明度:", indicatorOpacity.toFixed(2), "显示:", isBannerVisible && indicatorOpacity >= 0.1);
          }
        }
        ticking = false;
        return;
      }

      // 非全局背景模式：应用放大和固定效果
      // 在 Banner 可见范围内应用放大效果
      if (scrolled < currentBannerHeight) {
        // 计算缩放比例（向下滚动时放大）
        const scale = 1 + scrolled * 0.001;
        banner.style.transform = `scale(${scale})`;
        banner.style.willChange = "transform";

        // 滚动提示按钮逐渐淡出
        if (scrollIndicator) {
          // 检查 Banner 在视口中的位置
          const bannerRect = banner.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const isBannerVisible = bannerRect.bottom > 0 && bannerRect.top < viewportHeight;
          
          // 计算 Banner 在视口中的可见高度
          const visibleTop = Math.max(0, bannerRect.top);
          const visibleBottom = Math.min(viewportHeight, bannerRect.bottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);
          const visibleRatio = visibleHeight / currentBannerHeight; // Banner可见部分的比例
          
          // 计算透明度：基于Banner在视口中的可见比例
          // 当Banner完全可见时（visibleRatio >= 0.5），按钮完全显示
          // 当Banner部分可见时（visibleRatio < 0.5），按钮逐渐淡出
          let indicatorOpacity = 0;
          if (isBannerVisible && visibleRatio > 0) {
            if (visibleRatio >= 0.5) {
              // Banner至少50%可见，按钮完全显示
              indicatorOpacity = 1;
            } else {
              // Banner少于50%可见，按钮逐渐淡出
              indicatorOpacity = visibleRatio * 2; // 0-0.5 映射到 0-1
            }
          }
          
          // 只有当 Banner 可见且透明度足够时才显示按钮
          if (isBannerVisible && indicatorOpacity >= 0.1) {
            scrollIndicator.style.opacity = indicatorOpacity.toString();
            scrollIndicator.style.visibility = "visible";
            scrollIndicator.style.pointerEvents = "auto";
            scrollIndicator.classList.remove("hidden");
          } else {
            scrollIndicator.style.opacity = "0";
            scrollIndicator.style.visibility = "hidden";
            scrollIndicator.style.pointerEvents = "none";
            scrollIndicator.classList.add("hidden");
          }
          
          if (scrolled % 100 < 10) { // 每100px打印一次，避免日志过多
            console.log("[Banner Debug] 滚动中 - scrollY:", scrolled, "Banner可见:", isBannerVisible, "可见比例:", visibleRatio.toFixed(2), "opacity:", indicatorOpacity.toFixed(2), "visibility:", scrollIndicator.style.visibility);
          }
        }

        // 如果之前是固定状态，取消固定
        if (isFixed) {
          console.log("[Banner Debug] 取消固定状态");
          isFixed = false;
          banner.classList.remove("aurora-banner-fixed");
          const placeholder = document.querySelector(".aurora-banner-placeholder");
          if (placeholder) {
            placeholder.remove();
          }
        }
      } else {
        // 滚动超过 Banner 高度时，固定为背景
        if (!isFixed) {
          console.log("[Banner Debug] 固定为背景状态");
          isFixed = true;
          banner.classList.add("aurora-banner-fixed");
          // 添加占位元素，防止布局跳动
          const placeholder = document.createElement("div");
          placeholder.className = "aurora-banner-placeholder";
          placeholder.style.height = `${currentBannerHeight}px`;
          banner.parentNode?.insertBefore(placeholder, banner);
        }

        // 固定后，应用最终缩放
        const finalScale = 1 + currentBannerHeight * 0.001;
        banner.style.transform = `scale(${finalScale})`;
        if (scrollIndicator) {
          scrollIndicator.style.opacity = "0";
          scrollIndicator.style.visibility = "hidden";
          scrollIndicator.style.pointerEvents = "none";
        }
      }

      ticking = false;
    });
  };

  // 绑定滚动事件监听器（用于处理 Banner 滚动效果）
  console.log("[Banner Debug] 绑定滚动事件监听器");
  window.addEventListener("scroll", handleBannerEffect, { passive: true });
  
  console.log("[Banner Debug] 初始化 Banner 效果");
  handleBannerEffect(); // 初始化
  
  // 注意：此函数返回 void，清理函数需要通过其他方式管理
  // 如果需要清理，可以在外部保存 wheelScrollCleanup 引用
}

