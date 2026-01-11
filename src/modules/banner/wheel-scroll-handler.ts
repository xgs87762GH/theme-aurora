/**
 * Banner 鼠标滚动事件处理器
 * 条件：全屏 Banner 且高度超过视口 1/3 时才触发滚动跳转
 */

/**
 * Banner 滚动配置
 */
interface BannerWheelScrollConfig {
  /** Banner 元素 */
  banner: HTMLElement;
  /** 是否全屏 */
  isFullScreen: boolean;
  /** 是否使用全局背景 */
  useGlobalBg: boolean;
  /** Banner 高度 */
  bannerHeight: number;
  /** 视口高度 */
  viewportHeight: number;
  /** 滚轮增量阈值，默认 50 */
  threshold?: number;
  /** 防抖时间（毫秒），默认 300ms */
  debounce?: number;
  /** 滚动到内容区域的回调 */
  scrollToContent: () => void;
  /** 滚动到顶部的回调 */
  scrollToTop: () => void;
  /** 获取 isFixed 状态的回调 */
  getIsFixed: () => boolean;
  /** 设置 isFixed 状态的回调 */
  setIsFixed: (fixed: boolean) => void;
}

/**
 * 检查 Banner 是否满足滚动触发条件
 * 条件：全屏 Banner 且高度超过视口高度的 1/3
 * @param config 配置信息
 * @returns 是否满足条件
 */
function shouldTriggerScroll(config: BannerWheelScrollConfig): boolean {
  const { isFullScreen, bannerHeight, viewportHeight } = config;
  
  // 条件1: Banner 必须是全屏的
  if (!isFullScreen) {
    return false;
  }
  
  // 条件2: Banner 高度必须超过视口高度的 1/3（即 > viewportHeight / 3）
  const minHeightThreshold = viewportHeight / 3;
  if (bannerHeight <= minHeightThreshold) {
    return false;
  }
  
  return true;
}

/**
 * 创建 Banner 鼠标滚动事件处理器
 */
export function createBannerWheelScrollHandler(config: BannerWheelScrollConfig) {
  const {
    banner,
    isFullScreen,
    useGlobalBg: _useGlobalBg,
    bannerHeight: initialBannerHeight,
    viewportHeight: initialViewportHeight,
    threshold = 50,
    debounce = 300,
    scrollToContent,
    scrollToTop,
    getIsFixed,
    setIsFixed: _setIsFixed // 保留以备后用，暂时未使用，加下划线前缀避免警告
  } = config;

  let bannerHeight = initialBannerHeight;
  let viewportHeight = initialViewportHeight;
  let lastWheelTime = 0;
  let wheelDeltaAccumulator = 0;
  let lastDirection: 'up' | 'down' | null = null;

  // 更新 Banner 和视口高度（响应窗口缩放）
  const updateHeights = () => {
    bannerHeight = banner.offsetHeight;
    viewportHeight = window.innerHeight;
  };
  window.addEventListener("resize", updateHeights, { passive: true });

  // 滚轮事件处理函数
  const handleWheel = (e: WheelEvent) => {
    // 更新高度（可能窗口已改变）
    updateHeights();
    
    const now = Date.now();
    
    // 检查是否满足触发条件（每次滚动都检查）
    const currentScroll = window.scrollY;
    
    // 直接检查条件，不创建完整的 config 对象
    const currentConfig: BannerWheelScrollConfig = {
      ...config,
      bannerHeight,
      viewportHeight
    };
    
    if (!shouldTriggerScroll(currentConfig)) {
      // 不满足条件，允许正常滚动
      return;
    }

    const timeSinceLastWheel = now - lastWheelTime;
    const currentDirection: 'up' | 'down' = e.deltaY > 0 ? 'down' : 'up';
    const absDeltaY = Math.abs(e.deltaY);

    // 累积滚轮增量（只累积同方向的）
    if (lastDirection === null || lastDirection === currentDirection) {
      wheelDeltaAccumulator += absDeltaY;
    } else {
      // 方向改变，重置累积器
      wheelDeltaAccumulator = absDeltaY;
    }
    lastDirection = currentDirection;

    // 阈值检查（先检查，因为如果累积增量已经足够，即使时间间隔短也应该允许触发）
    if (wheelDeltaAccumulator < threshold) {
      // 如果累积增量不足，需要等待防抖时间
      if (timeSinceLastWheel < debounce) {
        return;
      }
      // 累积增量不足，但防抖时间已过，也跳过（说明用户只是轻微滚动）
      return;
    }

    // 累积增量已满足，检查防抖（但放宽条件：如果累积增量足够大，缩短防抖时间）
    // 如果累积增量 >= 阈值 * 2（即 >= 100），缩短防抖时间到 50ms（允许快速滚动触发）
    // 如果累积增量 >= 阈值 * 3（即 >= 150），完全忽略防抖（用户快速连续滚动）
    let effectiveDebounce = debounce;
    if (wheelDeltaAccumulator >= threshold * 3) {
      effectiveDebounce = 0; // 完全忽略防抖
    } else if (wheelDeltaAccumulator >= threshold * 2) {
      effectiveDebounce = 50; // 缩短防抖时间到 50ms
    }
    
    if (timeSinceLastWheel < effectiveDebounce) {
      return;
    }

    // 达到阈值，触发滚动跳转
    lastWheelTime = now;
    
    // 判断当前位置和滚动方向
    const isInBanner = currentScroll < bannerHeight;
    const isFixed = getIsFixed();
    const isScrollingDown = e.deltaY > 0;
    const isScrollingUp = e.deltaY < 0;
    
    // 情况1: 在 Banner 区域内向下滚动 → 跳转到内容区域
    if (isInBanner && !isFixed && isScrollingDown) {
      e.preventDefault();
      e.stopPropagation();
      wheelDeltaAccumulator = 0;
      scrollToContent();
      return;
    }

    // 情况2: 向上滚动 → 跳转到 Banner 顶部
    // 条件：
    // 1. 全屏 Banner 且高度超过视口 1/3
    // 2. 如果在 Banner 内部：直接触发（不需要检查距离）
    // 3. 如果在内容区域：需要检查导航栏底部位置距离 aurora-body 顶部的距离 > 视口高度的 1/4
    if (isScrollingUp) {
      // 检查 Banner 条件
      const minHeightThresholdForUp = viewportHeight / 3;
      const meetsBannerCondition = isFullScreen && bannerHeight > minHeightThresholdForUp;
      
      // 如果在 Banner 内部，直接触发跳转（不需要检查距离条件）
      if (isInBanner && meetsBannerCondition) {
        e.preventDefault();
        e.stopPropagation();
        wheelDeltaAccumulator = 0;
        scrollToTop();
        return;
      }
      
      // 如果在内容区域，需要检查距离条件
      // 检查 aurora-body 距离导航栏的距离
      // 条件：导航栏底部位置距离 aurora-body 顶部的距离 > 视口高度的 1/4
      // 注意：这里计算的是文档坐标中的绝对距离，但阈值使用视口高度（更合理）
      const auroraBody = document.querySelector(".aurora-body") as HTMLElement;
      const header = document.querySelector("#header-menu") as HTMLElement;
      
      let distanceFromHeader = 0;
      let meetsDistanceCondition = false;
      
      if (auroraBody && header) {
        // 使用 getBoundingClientRect + scrollY 计算元素在文档中的绝对位置（最准确的方法）
        const headerRect = header.getBoundingClientRect();
        const bodyRect = auroraBody.getBoundingClientRect();
        
        // 转换为文档坐标：getBoundingClientRect().top + window.scrollY
        // 导航栏底部在文档中的位置
        const headerBottomInDocument = headerRect.bottom + currentScroll;
        
        // aurora-body 顶部在文档中的位置
        const bodyTopInDocument = bodyRect.top + currentScroll;
        
        // 计算距离：aurora-body 顶部 - 导航栏底部（文档坐标中的距离）
        // 这个距离表示：从导航栏底部到 aurora-body 顶部之间有多少像素空间
        distanceFromHeader = bodyTopInDocument - headerBottomInDocument;
        
        // 检查距离是否 > 视口高度的 1/4
        // 只有当 aurora-body 在导航栏下方（距离为正）且距离足够大时才触发
        // 使用视口高度而不是网页高度，这样阈值更合理（视口是用户当前可见的屏幕高度）
        const minDistanceThreshold = viewportHeight / 4;
        meetsDistanceCondition = distanceFromHeader > minDistanceThreshold;
      } else {
        // 如果找不到元素，默认不满足条件
        meetsDistanceCondition = false;
      }
      
      if (meetsBannerCondition && meetsDistanceCondition) {
        e.preventDefault();
        e.stopPropagation();
        wheelDeltaAccumulator = 0;
        scrollToTop();
        return;
      }
    }

    // 其他情况：重置累积器，允许正常滚动
    wheelDeltaAccumulator = 0;
  };

  return {
    handleWheel,
    updateHeights
  };
}

/**
 * 初始化 Banner 鼠标滚动事件监听器
 */
export function initBannerWheelScrollHandler(
  banner: HTMLElement,
  isFullScreen: boolean,
  useGlobalBg: boolean,
  scrollToContent: () => void,
  scrollToTop: () => void,
  getIsFixed: () => boolean,
  setIsFixed: (fixed: boolean) => void
): () => void {
  const bannerHeight = banner.offsetHeight;
  const viewportHeight = window.innerHeight;
  const minHeightThreshold = viewportHeight / 3;

  // 再次检查条件（确保满足）
  if (!isFullScreen) {
    return () => {};
  }

  if (bannerHeight <= minHeightThreshold) {
    return () => {};
  }

  // 创建处理器，传入回调函数
  const handler = createBannerWheelScrollHandler({
    banner,
    isFullScreen,
    useGlobalBg,
    bannerHeight,
    viewportHeight,
    scrollToContent,
    scrollToTop,
    getIsFixed,
    setIsFixed
  });

  // 绑定事件监听器
  const wheelHandler = (e: WheelEvent) => {
    handler.handleWheel(e);
  };

  document.addEventListener("wheel", wheelHandler as EventListener, { passive: false });
  banner.addEventListener("wheel", wheelHandler as EventListener, { passive: false });

  // 返回清理函数
  return () => {
    document.removeEventListener("wheel", wheelHandler as EventListener);
    banner.removeEventListener("wheel", wheelHandler as EventListener);
  };
}

