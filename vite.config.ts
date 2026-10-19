import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules") && /tiptap|prosemirror|yjs|y-protocols|lib0|hocuspocus/.test(id)) return "collaboration";
          if (id.includes("node_modules")) return "vendor";
        },
      },
    },
  },
});
