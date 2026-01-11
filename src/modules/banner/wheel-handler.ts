/**
 * Banner 鼠标滚动事件处理器
 */

/**
 * Banner 滚动事件配置
 */
export interface BannerWheelHandlerOptions {
  /**
   * Banner 元素
   */
  banner: HTMLElement;
  /**
   * 是否使用全局背景模式
   */
  useGlobalBg: boolean;
  /**
   * 滚轮增量阈值，只有累积超过这个值才触发，默认 50
   */
  threshold?: number;
  /**
   * 防抖时间（毫秒），默认 300ms
   */
  debounce?: number;
  /**
   * 滚动回调函数
   */
  onWheel?: (event: WheelEvent, delta: number, direction: 'up' | 'down', scrollY: number) => void;
}

/**
 * 创建 Banner 鼠标滚动事件处理器
 */
export function createBannerWheelHandler(options: BannerWheelHandlerOptions): () => void {
  const {
    banner,
    useGlobalBg: _useGlobalBg,
    threshold = 50,
    debounce = 300,
    onWheel
  } = options;

  let lastWheelTime = 0;
  let wheelDeltaAccumulator = 0;
  let lastDirection: 'up' | 'down' | null = null;

  const handleWheel = (e: WheelEvent) => {
    const now = Date.now();
    const timeSinceLastWheel = now - lastWheelTime;
    const currentScroll = window.scrollY;
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

    // 防抖检查
    if (timeSinceLastWheel < debounce) {
      return;
    }

    // 阈值检查
    if (wheelDeltaAccumulator < threshold) {
      return;
    }

    // 达到阈值，触发回调
    if (onWheel) {
      onWheel(e, wheelDeltaAccumulator, currentDirection, currentScroll);
    }

    // 重置状态
    lastWheelTime = now;
    wheelDeltaAccumulator = 0;
  };

  // 绑定到 document 和 banner 元素
  document.addEventListener("wheel", handleWheel as EventListener, { passive: false });
  banner.addEventListener("wheel", handleWheel as EventListener, { passive: false });

  console.log("[Banner Wheel] 滚动事件监听器已绑定");

  // 返回清理函数
  return () => {
    document.removeEventListener("wheel", handleWheel as EventListener);
    banner.removeEventListener("wheel", handleWheel as EventListener);
    console.log("[Banner Wheel] 滚动事件监听器已移除");
  };
}

/**
 * 简单的 Banner 滚动事件监听器（快捷方式）
 */
export function onBannerWheel(
  banner: HTMLElement,
  callback: (event: WheelEvent, delta: number, direction: 'up' | 'down', scrollY: number) => void,
  options?: Omit<BannerWheelHandlerOptions, 'banner' | 'onWheel'>
): () => void {
  return createBannerWheelHandler({
    banner,
    useGlobalBg: banner.getAttribute("data-use-global-bg") === "true",
    ...options,
    onWheel: callback
  });
}

