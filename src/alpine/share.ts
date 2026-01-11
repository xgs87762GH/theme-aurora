import Alpine from "alpinejs";

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

