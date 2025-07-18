import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";
// import viteCompression from "vite-plugin-compression";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const { dependencies } = JSON.parse(
  fs.readFileSync(path.join(dirname, "package.json"), "utf-8")
) as { dependencies: Record<string, string> };

const vendorPackages: string[] = [
  "react",
  "react-router-dom",
  "react-router",
  "react-dom",
];

function renderChunks(deps: Record<string, string>) {
  const chunks: Record<string, string[]> = {};
  Object.keys(deps).forEach((key) => {
    if (vendorPackages.includes(key)) return;
    chunks[key] = [key];
  });
  return chunks;
}

export const OUTPUT_DIRECTORY = "dist";

const pwaConfig: Partial<VitePWAOptions> = {
  injectRegister: "script",
  registerType: "autoUpdate",
  devOptions: {
    enabled: true,
  },
  manifest: {
    icons: [
      {
        src: "/icons/pwa-64x64.png",
        sizes: "64x64",
        type: "image/png",
      },
      {
        src: "/icons/pwa-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/apple-touch-icon-180x180.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/icons/pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/maskable-icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    name: "Baas Wireframe",
    short_name: "BaasW",
    display: "standalone",
    background_color: "#ffffff",
    description: "A Wireframe Builder tool.",
    theme_color: "#000000",
    start_url: "/admin/login",
  },
};

const config: UserConfig = {
  plugins: [
    react(),
    VitePWA(pwaConfig),
    // viteCompression({
    //   algorithm: "brotliCompress",
    //   filter: /\.(js|mjs|json|css|html)$/i,
    //   deleteOriginFile: false,
    // }),
  ],
  build: {
    outDir: OUTPUT_DIRECTORY,
    sourcemap: false,
    rollupOptions: {
      external: ["fsevents"],
      output: {
        manualChunks: {
          vendor: vendorPackages,
          ...renderChunks(dependencies),
        },
      },
    },
  },
  resolve: {
    alias: {
      "@/components": path.resolve(dirname, "./src/components"),
      "@/pages": path.resolve(dirname, "./src/pages"),
      "@/utils": path.resolve(dirname, "./src/utils"),
      "@/assets": path.resolve(dirname, "./src/assets"),
      "@/context": path.resolve(dirname, "./src/context"),
      "@/routes": path.resolve(dirname, "./src/routes"),
      "@/query": path.resolve(dirname, "./src/query"),
      "@/hooks": path.resolve(dirname, "./src/hooks"),
      "@": path.resolve(dirname, "./src"),
    },
  },
  server: {
    port: parseInt(process.env.PORT || "3001"),
  },
};

export default defineConfig(config);
