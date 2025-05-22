import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: {
    enabled: process.env.NODE_ENV !== "production",
  },
  css: ["@/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  ssr: true,
  nitro: {
    preset: "netlify",
    serveStatic: true,
  },
});
