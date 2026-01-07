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

// Category Filter - 分类筛选器（检测溢出 + 筛选功能）
Alpine.data("categoryFilter", () => ({
  expanded: false,
  needsCollapse: false,
  selectedCategory: null as string | null,
  isLoading: false,
  checkOverflow() {
    this.$nextTick(() => {
      const filterList = this.$refs.filterList;
      if (!filterList) return;
      
      // 临时移除高度限制和溢出隐藏，以获取内容的真实尺寸
      const originalMaxHeight = filterList.style.maxHeight;
      const originalOverflow = filterList.style.overflow;
      filterList.style.maxHeight = "none";
      filterList.style.overflow = "visible";
      
      // 获取内容的实际高度
      const contentHeight = filterList.scrollHeight;
      const maxHeight = 72; // 4.5rem = 72px (约2行)
      
      // 恢复原始样式
      filterList.style.maxHeight = originalMaxHeight;
      filterList.style.overflow = originalOverflow;
      
      // 判断是否需要折叠：内容高度超过最大高度（2行）
      // 当内容被 flex-wrap 包裹时，如果高度超过 2 行，说明内容过多需要折叠
      this.needsCollapse = contentHeight > maxHeight;
    });
  },
  initCategoryFilter() {
    // 从 URL 参数中获取当前选中的分类
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get("category");
    this.selectedCategory = categoryParam;
  },
  async filterByCategory(categoryName: string | null) {
    if (this.isLoading) return;
    
    this.selectedCategory = categoryName;
    this.isLoading = true;
    
    try {
      // 构建 URL - 添加 fragment=post-list 参数，只获取文章列表片段
      const params = new URLSearchParams();
      if (categoryName) {
        params.append("category", categoryName);
      }
      params.append("fragment", "post-list");
      const url = `/?${params.toString()}`;
      
      // 更新浏览器地址栏（不刷新页面，但不包含 fragment 参数）
      const displayUrl = categoryName ? `/?category=${encodeURIComponent(categoryName)}` : "/";
      window.history.pushState({ category: categoryName }, "", displayUrl);
      
      // 获取文章列表片段（只返回 #post-list-container 内容）
      const response = await fetch(url, {
        headers: {
          "X-Requested-With": "XMLHttpRequest", // 标识为 AJAX 请求
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      
      // 查找文章列表容器
      const newPostListContainer = doc.querySelector("#post-list-container");
      
      // 获取当前的文章列表容器
      const currentPostListContainer = document.querySelector("#post-list-container");
      
      if (!currentPostListContainer) {
        throw new Error("Post list container not found");
      }
      
      // 替换整个文章列表容器
      if (newPostListContainer) {
        currentPostListContainer.innerHTML = newPostListContainer.innerHTML;
      } else {
        // 如果没有找到，显示错误
        currentPostListContainer.innerHTML = `
          <div class="flex items-center justify-center py-16">
            <div class="text-center">
              <span class="i-[tabler--file-off] text-6xl text-gray-300 dark:text-slate-600"></span>
              <p class="mt-4 text-sm font-light text-gray-500 dark:text-slate-400">加载失败，请刷新页面重试</p>
            </div>
          </div>
        `;
      }
      
      // 等待 DOM 更新后再滚动（使用双重 requestAnimationFrame 确保 DOM 已完全更新）
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // 滚动到文章列表顶部（平滑滚动）
          // 如果 banner 是全屏的，需要滚动到 banner 下方（文章列表位置）
          const fullBanner = document.querySelector(".aurora-top-banner-full");
          const postListContainer = document.querySelector("#post-list-container");
          const postList = document.querySelector("#post-list");
          
          if (fullBanner && postListContainer) {
            // Banner 是全屏的，滚动到文章列表容器顶部
            // 使用容器的实际位置，这样更准确
            const rect = postListContainer.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const targetY = scrollTop + rect.top - 20; // 20px 偏移，确保内容可见
            window.scrollTo({ top: targetY, behavior: "smooth" });
          } else if (postList) {
            // Banner 不是全屏的，滚动到文章列表顶部
            const rect = postList.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const targetY = scrollTop + rect.top - 20; // 20px 偏移
            window.scrollTo({ top: targetY, behavior: "smooth" });
          } else if (postListContainer) {
            // 如果没有文章列表，滚动到容器顶部
            const rect = postListContainer.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const targetY = scrollTop + rect.top - 20;
            window.scrollTo({ top: targetY, behavior: "smooth" });
          }
        });
      });
    } catch (error) {
      console.error("Failed to filter posts:", error);
      // 如果失败，回退到页面跳转
      window.location.href = categoryName ? `/?category=${encodeURIComponent(categoryName)}` : "/";
    } finally {
      this.isLoading = false;
    }
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

// Category Pagination
Alpine.data("categoryPagination", (totalItems: number) => {
  return {
    currentPage: 1,
    itemsPerPage: 5,
    totalItems: totalItems,
    getTotalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    },
    getStartIndex() {
      return (this.currentPage - 1) * this.itemsPerPage;
    },
    getEndIndex() {
      return this.getStartIndex() + this.itemsPerPage;
    },
    hasPrevious() {
      return this.currentPage > 1;
    },
    hasNext() {
      return this.currentPage < this.getTotalPages();
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.getTotalPages()) {
        this.currentPage++;
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
  // 全屏 Banner 上拉放大并固定为背景效果
  const fullBanner = document.querySelector(".aurora-top-banner-full");
  if (fullBanner) {
    const scrollIndicator = fullBanner.querySelector(".aurora-scroll-indicator");
    const scrollDownBtn = fullBanner.querySelector(".aurora-scroll-down-btn");
    const bannerElement = fullBanner as HTMLElement;
    let ticking = false;
    let isFixed = false;
    let hasScrolled = false; // 标记是否已经滚动过

    // 【修改点1】这里由 const 改为 let，以便后续更新高度
    let bannerHeight = bannerElement.offsetHeight;

    // 【修改点2】重写更新高度的逻辑，确保窗口缩放时高度变量同步更新
    const updateBannerHeight = () => {
      bannerHeight = bannerElement.offsetHeight;
    };
    // 保持监听 resize 事件，不要移除
    window.addEventListener("resize", updateBannerHeight);

    // 滚动提示按钮点击事件
    const scrollToContent = () => {
      window.scrollTo({
        top: bannerHeight, // 这里会使用最新的高度
        behavior: "smooth"
      });
    };

    if (scrollDownBtn) {
      scrollDownBtn.addEventListener("click", scrollToContent);
    }

    // 滚动到顶部（banner区域）- 使用instant避免闪烁
    const scrollToTop = () => {
      // 先重置banner的状态，避免闪烁
      if (isFixed) {
        isFixed = false;
        bannerElement.classList.remove("aurora-banner-fixed");
        const placeholder = document.querySelector(".aurora-banner-placeholder");
        if (placeholder) {
          placeholder.remove();
        }
      }
      // 重置transform
      bannerElement.style.transform = "";
      bannerElement.style.willChange = "";
      // 显示滚动提示按钮
      if (scrollIndicator) {
        (scrollIndicator as HTMLElement).style.opacity = "1";
      }
      // 立即跳转到顶部
      window.scrollTo({
        top: 0,
        behavior: "auto" // 使用auto而不是smooth，避免闪烁
      });
    };

    // 监听鼠标滚轮事件，实现双向跳转（banner ↔ 内容区域）
    const handleWheel = (e: Event) => {
      const wheelEvent = e as WheelEvent;
      const currentScroll = window.scrollY;

      // 情况1: 在banner区域内且向下滚动 → 跳转到内容区域
      if (currentScroll < bannerHeight && !isFixed && wheelEvent.deltaY > 0) {
        e.preventDefault();
        if (!hasScrolled) {
          hasScrolled = true;
          scrollToContent();
        }
        return;
      }

      // 情况2: 在内容区域顶部（banner高度附近）且向上滚动 → 跳转到banner顶部
      // 使用一个小的容差范围（±5px）来判断是否在内容区域顶部
      const contentTop = bannerHeight;
      const tolerance = 5;
      if (currentScroll >= contentTop - tolerance && currentScroll <= contentTop + tolerance && wheelEvent.deltaY < 0) {
        e.preventDefault();
        hasScrolled = false;
        scrollToTop();
        return;
      }

      // 情况3: 在内容区域中间（距离顶部超过tolerance）→ 完全不管，让浏览器正常处理
    };

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
              // 重置滚动标记
              hasScrolled = false;
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

    // 监听整个页面的wheel事件，实现双向跳转
    document.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", handleBannerEffect, { passive: true });
    handleBannerEffect(); // 初始化

  }

  // 处理 banner 中的文章隐藏
  // 当 banner 完全滚动出视口后，隐藏 banner 中的文章
  const handleBannerPostsHide = () => {
    const banner = document.querySelector(".aurora-top-banner");
    const debugInfo: any = {
      bannerExists: !!banner,
      bannerPostsContainerExists: false,
      scrollY: window.scrollY,
      bannerRect: null,
      isBannerOutOfView: false,
      action: "none"
    };

    if (!banner) {
      updateDebugInfo(debugInfo);
      return;
    }

    const bannerPostsContainer = banner.querySelector('[data-banner-posts="true"]') as HTMLElement;
    debugInfo.bannerPostsContainerExists = !!bannerPostsContainer;
    
    if (!bannerPostsContainer) {
      updateDebugInfo(debugInfo);
      return;
    }

    // 检测文章容器是否滚动出视口
    // 检查文章容器的位置，如果容器的底部已经滚动出视口顶部，就隐藏文章
    const bannerRect = banner.getBoundingClientRect();
    const containerRect = bannerPostsContainer.getBoundingClientRect();
    
    debugInfo.bannerRect = {
      top: bannerRect.top,
      bottom: bannerRect.bottom,
      height: bannerRect.height
    };
    
    debugInfo.containerRect = {
      top: containerRect.top,
      bottom: containerRect.bottom,
      height: containerRect.height
    };
    
    // 检查文章列表容器（aurora-three-column）在视口中的可见高度
    // 当文章列表容器占用屏幕2/3以上时，隐藏 banner 中的文章（兼容2/3屏配置）
    const postListContainer = document.querySelector(".aurora-three-column") as HTMLElement;
    const viewportHeight = window.innerHeight;
    const twoThirdViewportHeight = (viewportHeight * 2) / 3;
    
    const distanceFromTop = containerRect.top;
    const distanceFromBottom = containerRect.bottom;
    
    let postListContainerTop = 0;
    let postListContainerBottom = 0;
    let postListVisibleHeight = 0;
    let isPostListContainerHalfVisible = false;
    
    if (postListContainer) {
      const postListRect = postListContainer.getBoundingClientRect();
      postListContainerTop = postListRect.top;
      postListContainerBottom = postListRect.bottom;
      
      // 计算文章列表容器在视口中的可见高度
      // 如果容器顶部在视口上方，从视口顶部开始计算
      // 如果容器底部在视口下方，计算到视口底部
      const visibleTop = Math.max(0, postListRect.top);
      const visibleBottom = Math.min(viewportHeight, postListRect.bottom);
      postListVisibleHeight = Math.max(0, visibleBottom - visibleTop);
      
      // 当文章列表容器在视口中的可见高度超过视口高度的2/3时，隐藏 banner 中的文章（兼容2/3屏配置）
      isPostListContainerHalfVisible = postListVisibleHeight > twoThirdViewportHeight;
    }
    
    // 当 banner 中的文章容器顶部已经滚动出视口（距离 < 0）时，隐藏文章
    // 或者当文章列表容器占用屏幕2/3以上时，也隐藏 banner 中的文章（兼容2/3屏配置）
    const isContainerOutOfView = distanceFromTop < 0 || isPostListContainerHalfVisible;
    debugInfo.isBannerOutOfView = isContainerOutOfView;
    debugInfo.distanceFromTop = distanceFromTop;
    debugInfo.distanceFromBottom = distanceFromBottom;
    debugInfo.viewportHeight = viewportHeight;
    debugInfo.twoThirdViewportHeight = twoThirdViewportHeight;
    debugInfo.postListContainerTop = postListContainerTop;
    debugInfo.postListContainerBottom = postListContainerBottom;
    debugInfo.postListVisibleHeight = postListVisibleHeight;
    debugInfo.isPostListContainerHalfVisible = isPostListContainerHalfVisible;

    // 根据容器是否出视口来显示/隐藏文章
    if (isContainerOutOfView) {
      // Banner 完全滚动出视口，隐藏文章
      bannerPostsContainer.style.opacity = "0";
      bannerPostsContainer.style.visibility = "hidden";
      bannerPostsContainer.style.pointerEvents = "none";
      debugInfo.action = "hide";
    } else {
      // Banner 在视口中，显示文章
      bannerPostsContainer.style.opacity = "1";
      bannerPostsContainer.style.visibility = "visible";
      bannerPostsContainer.style.pointerEvents = "auto";
      debugInfo.action = "show";
    }

    // 收集布局信息
    const postCards = document.querySelectorAll('.aurora-post-card');
    if (postCards.length > 0) {
      const firstCard = postCards[0] as HTMLElement;
      const computedStyle = window.getComputedStyle(firstCard);
      const imageWrapper = firstCard.querySelector('.aurora-post-card-image-wrapper') as HTMLElement;
      const statsOverlay = firstCard.querySelector('.aurora-post-stats-overlay') as HTMLElement;
      const statsInContent = firstCard.querySelector('.aurora-post-card-content .aurora-post-stats') as HTMLElement;
      const imageElement = firstCard.querySelector('.aurora-post-card-image') as HTMLElement;
      const placeholderIcon = firstCard.querySelector('.aurora-post-card-placeholder-icon') as HTMLElement;
      
      // 检查是否有图片
      const hasImage = imageElement !== null && imageElement.tagName === 'IMG';
      const hasPlaceholder = placeholderIcon !== null;
      
      // 检查统计信息元素
      const statsOverlayVisible = statsOverlay && window.getComputedStyle(statsOverlay).display !== 'none';
      const statsInContentVisible = statsInContent && window.getComputedStyle(statsInContent).display !== 'none';
      const statsOverlayChildren = statsOverlay ? statsOverlay.querySelectorAll('.aurora-post-stat-overlay').length : 0;
      const statsInContentChildren = statsInContent ? statsInContent.querySelectorAll('.aurora-post-stat').length : 0;
      
      debugInfo.layoutInfo = {
        '卡片 flex-direction': computedStyle.flexDirection,
        '卡片 display': computedStyle.display,
        '图片容器存在': imageWrapper ? '✓' : '✗',
        '图片容器 display': imageWrapper ? window.getComputedStyle(imageWrapper).display : 'N/A',
        '图片容器 position': imageWrapper ? window.getComputedStyle(imageWrapper).position : 'N/A',
        '有图片元素': hasImage ? '✓' : '✗',
        '有占位符': hasPlaceholder ? '✓' : '✗',
        '统计信息在图片上': statsOverlay ? '✓' : '✗',
        '图片上统计项数量': statsOverlayChildren.toString(),
        '图片上统计信息可见': statsOverlayVisible ? '✓' : '✗',
        '统计信息在内容区': statsInContent ? '✓' : '✗',
        '内容区统计项数量': statsInContentChildren.toString(),
        '内容区统计信息可见': statsInContentVisible ? '✓' : '✗'
      };
    }

    updateDebugInfo(debugInfo);
  };

  // 更新调试信息到页面
  const updateDebugInfo = (info: any) => {
    const debugPanel = document.getElementById("banner-posts-debug");
    if (debugPanel) {
      debugPanel.innerHTML = `
        <div style="background: rgba(0,0,0,0.8); color: white; padding: 10px; border-radius: 5px; font-size: 12px; position: fixed; top: 10px; right: 10px; z-index: 9999; max-width: 300px;">
          <div><strong>Banner 文章隐藏调试</strong></div>
          <div>Banner 存在: ${info.bannerExists ? "✓" : "✗"}</div>
          <div>文章容器存在: ${info.bannerPostsContainerExists ? "✓" : "✗"}</div>
          <div>滚动位置: ${info.scrollY.toFixed(0)}px</div>
          ${info.bannerRect ? `
            <div>Banner Top: ${info.bannerRect.top.toFixed(0)}px</div>
            <div>Banner Bottom: ${info.bannerRect.bottom.toFixed(0)}px</div>
            <div>Banner Height: ${info.bannerRect.height.toFixed(0)}px</div>
          ` : ""}
          ${info.containerRect ? `
            <div>容器 Top: ${info.containerRect.top.toFixed(0)}px</div>
            <div>容器 Bottom: ${info.containerRect.bottom.toFixed(0)}px</div>
            <div>容器 Height: ${info.containerRect.height.toFixed(0)}px</div>
          ` : ""}
          ${info.viewportHeight !== undefined ? `<div>视口高度: ${info.viewportHeight.toFixed(0)}px</div>` : ""}
          ${info.twoThirdViewportHeight !== undefined ? `<div>视口2/3: ${info.twoThirdViewportHeight.toFixed(0)}px</div>` : ""}
          ${info.postListVisibleHeight !== undefined ? `<div>文章列表可见高度: ${info.postListVisibleHeight.toFixed(0)}px</div>` : ""}
          ${info.isPostListContainerHalfVisible !== undefined ? `<div>文章列表占2/3以上: ${info.isPostListContainerHalfVisible ? "✓" : "✗"}</div>` : ""}
          <div>Banner 出视口: ${info.isBannerOutOfView ? "✓" : "✗"}</div>
          <div>操作: ${info.action}</div>
          ${info.layoutInfo ? `
            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.3);">
              <div><strong>布局信息</strong></div>
              ${Object.entries(info.layoutInfo).map(([key, value]) => `<div>${key}: ${value}</div>`).join("")}
            </div>
          ` : ""}
        </div>
      `;
    }
  };

  // 监听滚动事件，检测 banner 是否完全滚动出视口
  let bannerPostsHideTicking = false;
  const handleBannerPostsHideScroll = () => {
    if (!bannerPostsHideTicking) {
      window.requestAnimationFrame(() => {
        handleBannerPostsHide();
        bannerPostsHideTicking = false;
      });
      bannerPostsHideTicking = true;
    }
  };

  window.addEventListener("scroll", handleBannerPostsHideScroll, { passive: true });
  // 初始化检查一次
  handleBannerPostsHide();
  
  // 创建调试面板
  const debugPanel = document.createElement("div");
  debugPanel.id = "banner-posts-debug";
  document.body.appendChild(debugPanel);

  // Banner 轮播功能
  const initBannerCarousel = () => {
    const carouselContainer = document.querySelector(".aurora-banner-carousel-container");
    if (!carouselContainer) return;

    const slides = carouselContainer.querySelectorAll(".aurora-banner-carousel-slide");
    if (slides.length <= 1) return;

    let currentIndex = 0;
    const totalSlides = slides.length;
    const switchInterval = 5000; // 5秒切换一次
    let carouselTimer: number | null = null;

    const switchSlide = () => {
      // 隐藏当前幻灯片
      (slides[currentIndex] as HTMLElement).classList.remove("opacity-100");
      (slides[currentIndex] as HTMLElement).classList.add("opacity-0");

      // 切换到下一张
      currentIndex = (currentIndex + 1) % totalSlides;

      // 显示下一张幻灯片
      (slides[currentIndex] as HTMLElement).classList.remove("opacity-0");
      (slides[currentIndex] as HTMLElement).classList.add("opacity-100");
    };

    const startCarousel = () => {
      if (carouselTimer) {
        clearInterval(carouselTimer);
      }
      carouselTimer = window.setInterval(switchSlide, switchInterval);
    };

    const stopCarousel = () => {
      if (carouselTimer) {
        clearInterval(carouselTimer);
        carouselTimer = null;
      }
    };

    // 启动自动轮播
    startCarousel();

    // 鼠标悬停时暂停轮播
    carouselContainer.addEventListener("mouseenter", stopCarousel);

    // 鼠标离开时恢复轮播
    carouselContainer.addEventListener("mouseleave", startCarousel);
  };

  // 初始化轮播
  initBannerCarousel();

  // Banner 背景行为策略模式
  interface BannerBackgroundStrategy {
    init(banner: HTMLElement): void;
    handleScroll(banner: HTMLElement, scrollTop: number, bannerHeight: number): void;
    cleanup?(): void;
  }

  // 策略1: 全局背景模式（不淡出，作为全局背景）
  class GlobalBackgroundStrategy implements BannerBackgroundStrategy {
    init(_banner: HTMLElement): void {
      // 全局背景模式不需要滚动处理
      // 背景已经在 layout.html 中设置为 body 的背景
    }

    handleScroll(_banner: HTMLElement, _scrollTop: number, _bannerHeight: number): void {
      // 全局背景模式下，banner 背景不淡出
      // 不需要任何操作
    }
  }

  // 策略2: 滚动淡出模式（滚动时放大淡出）
  class ScrollFadeStrategy implements BannerBackgroundStrategy {
    private lastScrollTop = 0;
    private ticking = false;

    init(banner: HTMLElement): void {
      // 初始化滚动监听
      const handleScroll = () => {
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

      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    handleScroll(banner: HTMLElement, scrollTop: number, bannerHeight: number): void {
      const scrollThreshold = bannerHeight * 0.3; // 滚动到 banner 高度的 30% 时开始效果

      if (scrollTop > scrollThreshold && scrollTop > this.lastScrollTop) {
        // 向下滚动，添加 scrolling 类
        banner.classList.add('scrolling');
      } else if (scrollTop <= scrollThreshold || scrollTop < this.lastScrollTop) {
        // 向上滚动或回到顶部，移除 scrolling 类
        banner.classList.remove('scrolling');
      }
    }
  }

  // Banner 背景策略管理器
  const initBannerBackgroundStrategy = () => {
    const fullScreenBanner = document.querySelector('.aurora-top-banner-full[data-full-screen="true"]') as HTMLElement;
    if (!fullScreenBanner) return;

    const useGlobalBg = fullScreenBanner.getAttribute('data-use-global-bg') === 'true';
    
    // 根据配置选择策略
    const strategy: BannerBackgroundStrategy = useGlobalBg 
      ? new GlobalBackgroundStrategy() 
      : new ScrollFadeStrategy();

    // 初始化策略
    strategy.init(fullScreenBanner);
  };

  // 初始化 Banner 背景策略
  initBannerBackgroundStrategy();
});

window.main = main;

Alpine.start();

export default main;
