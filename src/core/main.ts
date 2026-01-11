import { initColorScheme, setColorScheme } from "../utils/color-scheme";

/**
 * Main object for global functions
 */
export const main = {
  initColorScheme,
  setColorScheme,

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

