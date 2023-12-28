import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  return {
    build: {
      outDir: "build",
    },
    plugins: [
      react({
        include: "**/*.tsx",
      }),
    ],
    optimizeDeps: {
      exclude: ["js-big-decimal"],
    },
  };
});
