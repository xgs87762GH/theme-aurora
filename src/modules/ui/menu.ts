/**
 * 设置导航栏 active 状态
 */
export function setActiveMenuItems(): void {
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

