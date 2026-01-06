import "./styles/tailwind.css";
import "./styles/main.css";
import Alpine from "alpinejs";

window.Alpine = Alpine;

// Color Scheme Switcher
Alpine.data("colorSchemeSwitcher", () => {
  const i18n = window.i18nResources || {};
  const colorSchemes = [
    {
      value: "light",
      label: i18n["jsModule.colorSchemeSwitcher.light"] || "浅色",
      icon: "i-tabler-sun",
    },
    {
      value: "dark",
      label: i18n["jsModule.colorSchemeSwitcher.dark"] || "深色",
      icon: "i-tabler-moon",
    },
    {
      value: "system",
      label: i18n["jsModule.colorSchemeSwitcher.auto"] || "跟随系统",
      icon: "i-tabler-device-desktop",
    },
  ];

  const getCurrentColorScheme = () => {
    const stored = localStorage.getItem("color-scheme");
    if (stored) return stored;
    return "system";
  };

  return {
    currentValue: getCurrentColorScheme(),
    colorSchemes,
    get colorScheme() {
      return colorSchemes.find((s) => s.value === this.currentValue) || colorSchemes[2];
    },
  };
});

// Dropdown
Alpine.data("dropdown", () => ({
  show: false,
  open() {
    this.show = true;
  },
  close() {
    this.show = false;
  },
}));

// Upvote
Alpine.data("upvote", (kind: string, group: string, plural: string) => {
  const i18n = window.i18nResources || {};
  const upvotedItems = JSON.parse(localStorage.getItem("upvoted-items") || "[]");

  return {
    upvoted(name: string) {
      return upvotedItems.includes(name);
    },
    async handleUpvote(name: string) {
      if (this.upvoted(name)) return;

      try {
        const response = await fetch(`/apis/api.halo.run/v1alpha1/trackers/${group}/${plural}/${name}/upvote`, {
          method: "POST",
        });

        if (response.ok) {
          upvotedItems.push(name);
          localStorage.setItem("upvoted-items", JSON.stringify(upvotedItems));
          const countElement = document.querySelector(`[data-upvote-${kind}-name="${name}"]`);
          if (countElement) {
            const currentCount = parseInt(countElement.textContent || "0");
            countElement.textContent = (currentCount + 1).toString();
          }
        } else {
          alert(i18n["jsModule.upvote.networkError"] || "网络错误");
        }
      } catch (error) {
        alert(i18n["jsModule.upvote.networkError"] || "网络错误");
      }
    },
  };
});

// Share
Alpine.data("share", (shareItemIds: string[] = []) => {
  const shareModal = false;
  const permalink = window.location.href;
  const copied = false;

  const shareItems = [
    { id: "wechat", name: "微信", icon: "i-simple-icons-wechat" },
    { id: "x", name: "X", icon: "i-simple-icons-x" },
    { id: "telegram", name: "Telegram", icon: "i-simple-icons-telegram" },
    { id: "facebook", name: "Facebook", icon: "i-simple-icons-facebook" },
    { id: "qq", name: "QQ", icon: "i-simple-icons-tencentqq" },
    { id: "qzone", name: "QQ 空间", icon: "i-simple-icons-qzone" },
    { id: "weibo", name: "微博", icon: "i-simple-icons-sinaweibo" },
    { id: "douban", name: "豆瓣", icon: "i-simple-icons-douban" },
    { id: "native", name: "系统分享", icon: "i-tabler-share" },
  ];

  return {
    shareModal,
    permalink,
    copied,
    get activeShareItems() {
      if (!shareItemIds || shareItemIds.length === 0) return shareItems;
      return shareItems.filter((item) => shareItemIds.includes(item.id));
    },
    handleShare(id: string) {
      const title = document.title;
      const url = this.permalink;

      switch (id) {
        case "wechat":
          // WeChat sharing requires QR code
          break;
        case "x":
          window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`);
          break;
        case "telegram":
          window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`);
          break;
        case "facebook":
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
          break;
        case "qq":
          window.open(`https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`);
          break;
        case "qzone":
          window.open(`https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`);
          break;
        case "weibo":
          window.open(`https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`);
          break;
        case "douban":
          window.open(`https://www.douban.com/share/service?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`);
          break;
        case "native":
          if (navigator.share) {
            navigator.share({ title, url });
          }
          break;
      }
    },
    handleCopy() {
      navigator.clipboard.writeText(this.permalink).then(() => {
        this.copied = true;
        setTimeout(() => {
          this.copied = false;
        }, 2000);
      });
    },
  };
});

// UI Permission
Alpine.data("uiPermission", (_username: string, _permission: string) => {
  return {
    shouldDisplay: false, // This should be set based on actual permission check
  };
});

// Main object for global functions
const main = {
  initColorScheme(defaultScheme: string, enableChange: boolean) {
    const getSystemColorScheme = () => {
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
      return "light";
    };

    const applyColorScheme = (scheme: string) => {
      const actualScheme = scheme === "system" ? getSystemColorScheme() : scheme;
      if (actualScheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    const stored = localStorage.getItem("color-scheme");
    const scheme = stored || defaultScheme || "system";
    applyColorScheme(scheme);

    if (enableChange) {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
        const currentScheme = localStorage.getItem("color-scheme") || defaultScheme || "system";
        if (currentScheme === "system") {
          applyColorScheme("system");
        }
      });
    }
  },

  setColorScheme(scheme: string, save: boolean = true) {
    if (save) {
      localStorage.setItem("color-scheme", scheme);
    }

    const getSystemColorScheme = () => {
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
      return "light";
    };

    const actualScheme = scheme === "system" ? getSystemColorScheme() : scheme;
    if (actualScheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  },

  generateToc() {
    const content = document.getElementById("content");
    if (!content) return;

    const headings = content.querySelectorAll("h1, h2, h3, h4, h5, h6");
    const tocContainer = document.querySelector(".toc");
    if (!tocContainer) return;

    const toc: { level: number; text: string; id: string }[] = [];

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      const text = heading.textContent || "";
      const id = `heading-${index}`;

      heading.id = id;
      toc.push({ level, text, id });
    });

    const tocHTML = toc
      .map((item) => {
        const indent = (item.level - 1) * 1;
        return `<a href="#${item.id}" class="block py-1 text-sm text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-slate-100" style="padding-left: ${indent}rem">${item.text}</a>`;
      })
      .join("");

    tocContainer.innerHTML = tocHTML;
  },

  /**
   * 将元素插入到侧边栏部件容器内
   * @param elementSelector - 要移动的元素选择器（如 ".toc-container"）
   * @param sidebarPosition - 侧边栏位置：'left' | 'right'，默认为 'right'
   * @param insertPosition - 插入位置：'first' | 'last'，默认为 'first'
   * @param markerClass - 添加到 sidebar 的标记类名，用于 CSS 选择器，默认为 null
   * @returns Promise<boolean> - 是否成功插入
   */
  insertToSidebar(
    elementSelector: string,
    sidebarPosition: 'left' | 'right' = 'right',
    insertPosition: 'first' | 'last' = 'first',
    markerClass: string | null = null
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const tryInsert = () => {
        const element = document.querySelector(elementSelector);
        const sidebarSelector = `.aurora-${sidebarPosition}-sidebar .aurora-sidebar`;
        const sidebar = document.querySelector(sidebarSelector);
        
        if (!element || !sidebar) {
          // 如果还没加载完成，延迟重试（最多重试 20 次，约 1 秒）
          const retryCount = (tryInsert as any).retryCount || 0;
          if (retryCount < 20) {
            (tryInsert as any).retryCount = retryCount + 1;
            setTimeout(tryInsert, 50);
          } else {
            resolve(false);
          }
          return;
        }

        // 检查元素是否已经在 sidebar 内
        if (sidebar.contains(element)) {
          // 如果已经在 sidebar 内，添加标记类（如果提供）
          if (markerClass) {
            sidebar.classList.add(markerClass);
          }
          resolve(true);
          return;
        }

        // 将元素插入到指定位置
        if (insertPosition === 'first') {
          sidebar.insertBefore(element, sidebar.firstChild);
        } else {
          sidebar.appendChild(element);
        }
        
        // 添加标记类（如果提供）
        if (markerClass) {
          sidebar.classList.add(markerClass);
        }
        
        resolve(true);
      };

      // 立即尝试
      (tryInsert as any).retryCount = 0;
      tryInsert();
    });
  },

};

// Scroll to top button
// 设置导航栏 active 状态
function setActiveMenuItems() {
  const currentPath = window.location.pathname;
  const menuLinks = document.querySelectorAll('[data-menu-href]');
  
  menuLinks.forEach((link) => {
    const href = link.getAttribute('data-menu-href');
    if (!href) return;
    
    // 规范化路径（移除尾部斜杠，除了根路径）
    const normalizedCurrentPath = currentPath === '/' ? '/' : currentPath.replace(/\/$/, '');
    const normalizedHref = href === '/' ? '/' : href.replace(/\/$/, '');
    
    // 检查是否匹配
    const isActive = 
      normalizedCurrentPath === normalizedHref ||
      (normalizedCurrentPath !== '/' && normalizedHref !== '/' && normalizedCurrentPath.startsWith(normalizedHref));
    
    if (isActive) {
      link.classList.add('text-blue-600', 'font-semibold', 'dark:text-blue-400');
      // 如果是子菜单项，也添加背景色
      const parentLi = link.closest('li');
      if (parentLi && parentLi.parentElement?.classList.contains('menu-dropdown')) {
        parentLi.classList.add('bg-blue-50', 'dark:bg-blue-900/20');
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // 设置导航栏 active 状态
  setActiveMenuItems();
  const scrollButton = document.getElementById("btn-scroll-to-top");
  if (!scrollButton) return;

  const handleScroll = () => {
    if (window.scrollY > 300) {
      scrollButton.classList.remove("opacity-0");
      scrollButton.classList.add("opacity-100");
    } else {
      scrollButton.classList.add("opacity-0");
      scrollButton.classList.remove("opacity-100");
    }
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();

  scrollButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // 全屏 Banner 上拉放大并固定为背景效果
  const fullBanner = document.querySelector(".aurora-top-banner-full");
  if (fullBanner) {
    const scrollIndicator = fullBanner.querySelector(".aurora-scroll-indicator");
    const scrollDownBtn = fullBanner.querySelector(".aurora-scroll-down-btn");
    const bannerElement = fullBanner as HTMLElement;
    let ticking = false;
    let isFixed = false;
    const bannerHeight = bannerElement.offsetHeight;
    
    // 滚动提示按钮点击事件
    if (scrollDownBtn) {
      scrollDownBtn.addEventListener("click", () => {
        window.scrollTo({
          top: bannerHeight,
          behavior: "smooth"
        });
      });
    }
    
    const handleBannerEffect = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          const currentBannerHeight = bannerElement.offsetHeight;
          
          // 在 banner 可见范围内应用放大效果
          if (scrolled < currentBannerHeight) {
            // 计算缩放比例（向下滚动时放大）
            const scale = 1 + scrolled * 0.001; // 放大效果
            
            // 应用变换到 banner
            bannerElement.style.transform = `scale(${scale})`;
            bannerElement.style.willChange = "transform";
            
            // 滚动提示按钮逐渐淡出
            if (scrollIndicator) {
              const indicatorOpacity = Math.max(0, 1 - scrolled / currentBannerHeight * 2);
              (scrollIndicator as HTMLElement).style.opacity = indicatorOpacity.toString();
            }
            
            // 如果之前是固定状态，取消固定
            if (isFixed) {
              isFixed = false;
              bannerElement.classList.remove("aurora-banner-fixed");
              const placeholder = document.querySelector(".aurora-banner-placeholder");
              if (placeholder) {
                placeholder.remove();
              }
            }
          } else {
            // 滚动超过 banner 高度时，固定为背景
            if (!isFixed) {
              isFixed = true;
              bannerElement.classList.add("aurora-banner-fixed");
              // 添加占位元素，防止布局跳动
              const placeholder = document.createElement("div");
              placeholder.className = "aurora-banner-placeholder";
              placeholder.style.height = `${currentBannerHeight}px`;
              bannerElement.parentNode?.insertBefore(placeholder, bannerElement);
            }
            
            // 固定后，应用最终缩放
            const finalScale = 1 + currentBannerHeight * 0.001;
            bannerElement.style.transform = `scale(${finalScale})`;
            if (scrollIndicator) {
              (scrollIndicator as HTMLElement).style.opacity = "0";
            }
          }
          
          ticking = false;
        });
        
        ticking = true;
      }
    };

    // 初始化时计算 banner 高度
    const updateBannerHeight = () => {
      const height = bannerElement.offsetHeight;
      if (height > 0) {
        window.removeEventListener("resize", updateBannerHeight);
      }
    };
    
    window.addEventListener("resize", updateBannerHeight);
    window.addEventListener("scroll", handleBannerEffect, { passive: true });
    handleBannerEffect(); // 初始化
  }
});

window.main = main;

Alpine.start();

export default main;
