/// <reference types="vite/client" />

import type { Alpine } from "alpinejs";

export {};

declare global {
  interface Window {
    Alpine: Alpine;
    i18nResources?: Record<string, string>;
    main?: {
      initColorScheme: (defaultScheme: string, enableChange: boolean) => void;
      setColorScheme: (scheme: string, save?: boolean) => void;
      generateToc: () => void;
    };
  }
}
