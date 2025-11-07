import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Permet les connexions depuis l'extérieur
    port: 5173,
    hmr: {
      host: "qcm.pourquoi-vacciner.fr", // Utilise le domaine externe pour le WebSocket HMR
      protocol: "wss", // Utilise wss si le site est en HTTPS, sinon 'ws'
      clientPort: 443, // Port HTTPS standard, ajustez si nécessaire
    },
    // Configuration du proxy pour éviter les problèmes CORS
    // Les requêtes vers /api seront redirigées vers le backend FastAPI
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // Enlève /api du chemin
        secure: false, // Si vous utilisez HTTPS avec certificat auto-signé
      },
    },
  },
});
