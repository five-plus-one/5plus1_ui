import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import pkg from "./package.json";
import { createHash } from 'node:crypto';
const dependencies = [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.peerDependencies),
];
export default defineConfig({
  plugins: [react(), {
    name: 'extract-library-fonts',
    generateBundle: { order: 'post', handler(_options, bundle) {
      for (const asset of Object.values(bundle)) {
        if (asset.type !== 'asset' || !asset.fileName.endsWith('.css')) continue;
        asset.source = String(asset.source).replace(/url\(["']?data:(?:font|application)\/([^;,]+)(?:;charset=[^;,]+)?;base64,([A-Za-z0-9+/=]+)["']?\)/g, (_match, mime, data) => {
          const bytes = Buffer.from(data, 'base64');
          const extension = mime.includes('woff2') ? 'woff2' : mime.includes('woff') ? 'woff' : 'ttf';
          const fileName = `fonts/${createHash('sha256').update(bytes).digest('hex').slice(0, 16)}.${extension}`;
          if (!bundle[fileName]) this.emitFile({ type: 'asset', fileName, source: bytes });
          return `url(./${fileName})`;
        });
      }
    } },
  }],
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
