import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import path from "path";

export default defineConfig({
  plugins: [],
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
