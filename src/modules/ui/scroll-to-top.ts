/**
 * 滚动到顶部按钮
 */
export function initScrollToTopButton(): void {
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

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  scrollButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

