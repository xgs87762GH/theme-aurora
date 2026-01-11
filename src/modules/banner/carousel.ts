/**
 * Banner 轮播功能
 */
export function initBannerCarousel(): void {
  // 查找轮播容器（根据 home-layout.html 的结构）
  const carouselContainer = document.querySelector(
    ".aurora-banner-carousel-container"
  ) as HTMLElement;
  if (!carouselContainer) return;

  // 查找所有幻灯片（根据 home-layout.html 的结构）
  const slides = carouselContainer.querySelectorAll(
    ".aurora-banner-carousel-slide"
  ) as NodeListOf<HTMLElement>;
  if (slides.length <= 1) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  const switchInterval = 5000; // 5秒切换一次
  let carouselTimer: number | null = null;

  const switchSlide = () => {
    // 隐藏当前幻灯片
    slides[currentIndex].classList.remove("opacity-100");
    slides[currentIndex].classList.add("opacity-0");

    // 切换到下一张
    currentIndex = (currentIndex + 1) % totalSlides;

    // 显示下一张幻灯片
    slides[currentIndex].classList.remove("opacity-0");
    slides[currentIndex].classList.add("opacity-100");
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
  carouselContainer.addEventListener("mouseleave", startCarousel);
}

