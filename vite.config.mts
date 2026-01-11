import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import path from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TARGET_DIR = path.resolve(__dirname, "../../halo2-dev/themes/theme-aurora");

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "templates",
          dest: TARGET_DIR,
        },
        {
          src: "i18n",
          dest: TARGET_DIR,
        },
        {
          src: "settings.yaml",
          dest: TARGET_DIR,
        },
        {
          src: "theme.yaml",
          dest: TARGET_DIR,
        },
      ],
    }),
  ],
  build: {
    outDir: fileURLToPath(new URL("./templates/assets/dist", import.meta.url)),
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, "src/main.ts"),
      name: "main",
      fileName: "main",
      formats: ["iife"],
    },
    rollupOptions: {
      output: {
        // 确保所有依赖都正确打包
        manualChunks: undefined,
      },
    },
  },
  optimizeDeps: {
    // 排除可能有问题的依赖，让它们使用原始模块
    exclude: ["transliteration"],
  },
});

