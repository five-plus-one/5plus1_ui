import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import pkg from "./package.json";
const dependencies = [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.peerDependencies),
];
export default defineConfig({
  plugins: [react()],
  publicDir: false,
  build: {
    outDir: "dist-library",
    lib: { entry: "src/lib/index.tsx", formats: ["es"], fileName: "index" },
    rollupOptions: {
      external: (id) =>
        dependencies.some((dep) => id === dep || id.startsWith(dep + "/")),
    },
  },
});
