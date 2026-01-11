/**
 * Banner 背景行为策略模式
 */

export interface BannerBackgroundStrategy {
  init(banner: HTMLElement): void;
  handleScroll(banner: HTMLElement, scrollTop: number, bannerHeight: number): void;
  cleanup?(): void;
}

// 策略1: 全局背景模式（不淡出，作为全局背景）
export class GlobalBackgroundStrategy implements BannerBackgroundStrategy {
  init(_banner: HTMLElement): void {
    // 全局背景模式不需要滚动处理
  }

  handleScroll(_banner: HTMLElement, _scrollTop: number, _bannerHeight: number): void {
    // 全局背景模式下，Banner 背景不淡出
  }
}

// 策略2: 滚动淡出模式（滚动时添加 scrolling 类）
export class ScrollFadeStrategy implements BannerBackgroundStrategy {
  private lastScrollTop = 0;
  private ticking = false;
  private scrollHandler: (() => void) | null = null;

  init(banner: HTMLElement): void {
    this.scrollHandler = () => {
      if (this.ticking) return;
      this.ticking = true;

      requestAnimationFrame(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const bannerHeight = banner.offsetHeight;
        this.handleScroll(banner, scrollTop, bannerHeight);
        this.lastScrollTop = scrollTop;
        this.ticking = false;
      });
    };

    window.addEventListener("scroll", this.scrollHandler, { passive: true });
  }

  handleScroll(banner: HTMLElement, scrollTop: number, bannerHeight: number): void {
    const scrollThreshold = bannerHeight * 0.3;

    if (scrollTop > scrollThreshold && scrollTop > this.lastScrollTop) {
      banner.classList.add("scrolling");
    } else if (scrollTop <= scrollThreshold || scrollTop < this.lastScrollTop) {
      banner.classList.remove("scrolling");
    }
  }

  cleanup(): void {
    if (this.scrollHandler) {
      window.removeEventListener("scroll", this.scrollHandler);
      this.scrollHandler = null;
    }
  }
}

/**
 * Banner 背景策略管理器
 */
export function initBannerBackgroundStrategy(
  banner: HTMLElement,
  isFullScreen: boolean,
  useGlobalBg: boolean
): void {
  // 全屏 Banner 且使用全局背景模式：不应用滚动淡出策略
  if (isFullScreen && useGlobalBg) {
    const strategy = new GlobalBackgroundStrategy();
    strategy.init(banner);
    return;
  }

  // 非全屏 Banner 或全屏 Banner 的非全局背景模式：应用滚动淡出策略
  if (!isFullScreen || !useGlobalBg) {
    const strategy = new ScrollFadeStrategy();
    strategy.init(banner);
  }
}

