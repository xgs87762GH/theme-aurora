/**
 * 通用鼠标滚动事件监听器
 */

export interface MouseWheelListenerOptions {
  /**
   * 滚动方向：'up' | 'down' | 'both'
   */
  direction?: 'up' | 'down' | 'both';
  /**
   * 防抖时间（毫秒），默认 100ms
   */
  debounce?: number;
  /**
   * 滚轮增量阈值，只有累积超过这个值才触发，默认 10
   */
  threshold?: number;
  /**
   * 是否阻止默认滚动行为，默认 false
   */
  preventDefault?: boolean;
  /**
   * 事件处理函数
   */
  onWheel: (event: WheelEvent, delta: number, direction: 'up' | 'down') => void;
}

/**
 * 创建鼠标滚动事件监听器
 * @param target 目标元素，默认为 document
 * @param options 配置选项
 * @returns 返回清理函数，用于移除事件监听器
 */
export function createMouseWheelListener(
  target: Document | HTMLElement = document,
  options: MouseWheelListenerOptions
): () => void {
  const {
    direction = 'both',
    debounce = 100,
    threshold = 10,
    preventDefault = false,
    onWheel
  } = options;

  let lastWheelTime = 0;
  let wheelDeltaAccumulator = 0;
  let lastDirection: 'up' | 'down' | null = null;

  const handleWheel = (e: WheelEvent) => {
    const now = Date.now();
    const timeSinceLastWheel = now - lastWheelTime;
    const currentDirection: 'up' | 'down' = e.deltaY > 0 ? 'down' : 'up';
    const absDeltaY = Math.abs(e.deltaY);

    // 检查方向是否匹配
    if (direction !== 'both' && currentDirection !== direction) {
      return;
    }

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

    // 触发回调
    if (preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }

    onWheel(e, wheelDeltaAccumulator, currentDirection);
    
    // 重置状态
    lastWheelTime = now;
    wheelDeltaAccumulator = 0;
  };

  target.addEventListener('wheel', handleWheel as EventListener, { passive: !preventDefault });

  // 返回清理函数
  return () => {
    target.removeEventListener('wheel', handleWheel as EventListener);
  };
}

/**
 * 简单的鼠标滚动事件监听器（快捷方式）
 * @param callback 滚动回调函数
 * @param options 可选配置
 * @returns 返回清理函数
 */
export function onMouseWheel(
  callback: (event: WheelEvent, delta: number, direction: 'up' | 'down') => void,
  options?: Omit<MouseWheelListenerOptions, 'onWheel'>
): () => void {
  return createMouseWheelListener(document, {
    ...options,
    onWheel: callback
  });
}

// 导出到 window 对象，方便在控制台使用
if (typeof window !== 'undefined') {
  (window as any).createMouseWheelListener = createMouseWheelListener;
  (window as any).onMouseWheel = onMouseWheel;
}

