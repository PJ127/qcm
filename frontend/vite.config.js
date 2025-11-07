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
    // Si vous utilisez un reverse proxy, vous pouvez aussi configurer :
    // strictPort: true,
    // watch: {
    //   usePolling: true
    // }
  },
});
