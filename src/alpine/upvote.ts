import Alpine from "alpinejs";

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

