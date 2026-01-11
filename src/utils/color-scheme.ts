/**
 * 颜色方案工具函数
 */

export function getSystemColorScheme(): 'light' | 'dark' {
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

export function applyColorScheme(scheme: string): void {
  const actualScheme = scheme === "system" ? getSystemColorScheme() : scheme;
  if (actualScheme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function initColorScheme(defaultScheme: string, enableChange: boolean): void {
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
}

export function setColorScheme(scheme: string, save: boolean = true): void {
  if (save) {
    localStorage.setItem("color-scheme", scheme);
  }
  applyColorScheme(scheme);
}

