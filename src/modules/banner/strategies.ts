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
  private bannerImageUrl: string | null = null;

  init(banner: HTMLElement): void {
    // 检查 Banner 类型，仅图片类型支持全局背景
    // 如果 Banner 包含轮播或视频，则不应用全局背景
    const hasCarousel = banner.querySelector('.aurora-banner-carousel-container');
    const hasVideo = banner.querySelector('.aurora-banner-video-element');
    
    if (hasCarousel || hasVideo) {
      // 轮播和视频类型不支持全局背景
      return;
    }

    // 获取 Banner 的背景图片 URL（仅支持图片类型）
    const bgImage = window.getComputedStyle(banner).backgroundImage;
    
    // 从 backgroundImage 字符串中提取 URL（格式：url("...") 或 url('...') 或 url(...)）
    const urlMatch = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
    if (urlMatch && urlMatch[1] && urlMatch[1] !== 'none') {
      this.bannerImageUrl = urlMatch[1];
      
      // 将 Banner 图片应用到 body 元素作为全局背景
      document.body.style.backgroundImage = bgImage;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundAttachment = 'fixed';
    }
  }

  handleScroll(_banner: HTMLElement, _scrollTop: number, _bannerHeight: number): void {
    // 全局背景模式下，Banner 背景不淡出
  }

  cleanup(): void {
    // 清理时移除 body 的背景图片
    if (this.bannerImageUrl) {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundRepeat = '';
      document.body.style.backgroundAttachment = '';
    }
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
  _isFullScreen: boolean,
  useGlobalBg: boolean
): void {
  // 使用全局背景模式：应用全局背景策略（不限制是否全屏）
  if (useGlobalBg) {
    const strategy = new GlobalBackgroundStrategy();
    strategy.init(banner);
    return;
  }

  // 非全局背景模式：应用滚动淡出策略
  const strategy = new ScrollFadeStrategy();
  strategy.init(banner);
}

