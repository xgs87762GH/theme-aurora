/**
 * Banner 中的文章隐藏处理
 */
export function initBannerPostsHide(): void {
  const banner = document.querySelector(".aurora-top-banner") as HTMLElement;
  if (!banner) return;

  // 查找 Banner 中的文章容器（根据 data 属性）
  const bannerPostsContainer = banner.querySelector(
    '[data-banner-posts="true"]'
  ) as HTMLElement;
  if (!bannerPostsContainer) return;

  let ticking = false;

  const handleBannerPostsHide = () => {
    if (ticking) return;
    ticking = true;

    window.requestAnimationFrame(() => {
      const containerRect = bannerPostsContainer.getBoundingClientRect();
      const postListContainer = document.querySelector(
        ".aurora-three-column"
      ) as HTMLElement;
      const viewportHeight = window.innerHeight;
      const twoThirdViewportHeight = (viewportHeight * 2) / 3;

      const distanceFromTop = containerRect.top;
      let isPostListContainerHalfVisible = false;

      if (postListContainer) {
        const postListRect = postListContainer.getBoundingClientRect();
        const visibleTop = Math.max(0, postListRect.top);
        const visibleBottom = Math.min(viewportHeight, postListRect.bottom);
        const postListVisibleHeight = Math.max(0, visibleBottom - visibleTop);
        isPostListContainerHalfVisible = postListVisibleHeight > twoThirdViewportHeight;
      }

      const isContainerOutOfView = distanceFromTop < 0 || isPostListContainerHalfVisible;

      // 根据容器是否出视口来显示/隐藏文章
      if (isContainerOutOfView) {
        bannerPostsContainer.style.opacity = "0";
        bannerPostsContainer.style.visibility = "hidden";
        bannerPostsContainer.style.pointerEvents = "none";
      } else {
        bannerPostsContainer.style.opacity = "1";
        bannerPostsContainer.style.visibility = "visible";
        bannerPostsContainer.style.pointerEvents = "auto";
      }

      ticking = false;
    });
  };

  window.addEventListener("scroll", handleBannerPostsHide, { passive: true });
  handleBannerPostsHide(); // 初始化检查
}

