import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables for the current mode (development / production)
  const env = loadEnv(mode, process.cwd(), "");

  const backendUrl = env.VITE_API_BASE_URL || "http://localhost:8080";

  return {
    plugins: [react()],

    // ── Environment variable prefix ─────────────────────────────────────────
    // Only variables prefixed with VITE_ are exposed to the browser bundle.
    envPrefix: "VITE_",

    // ── Dev server proxy ────────────────────────────────────────────────────
    // When USE_MOCKS = false, all /api/* requests from the browser are
    // forwarded to the Spring Boot backend. This avoids CORS issues during
    // local development without touching the backend CORS config.
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
          // Uncomment to strip /api prefix before forwarding (if backend
          // routes don't include /api):
          // rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },

    // ── Build output ────────────────────────────────────────────────────────
    build: {
      outDir: "dist",
      sourcemap: false,       // set to true for staging builds
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          // Split vendor chunks for better caching
          manualChunks(id) {
            if (id.includes("node_modules/react-dom") || id.includes("node_modules/react/")) {
              return "react";
            }
            if (id.includes("node_modules/react-router-dom") || id.includes("node_modules/react-router/")) {
              return "router";
            }
            if (id.includes("node_modules/bootstrap") || id.includes("node_modules/react-bootstrap")) {
              return "bootstrap";
            }
          },
        },
      },
    },
  };
});
