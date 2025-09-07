import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: "localhost",
    proxy: {
      "/v1": {
        target: "https://api-yeshtery.dev.meetusvr.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
