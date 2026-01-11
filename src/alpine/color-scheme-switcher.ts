import Alpine from "alpinejs";

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

