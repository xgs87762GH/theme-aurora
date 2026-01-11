import Alpine from "alpinejs";

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

