import { defineConfig } from "vite";

export default defineConfig({
    base: "/search/",
    server: {
        port: 5173,
        host: "127.0.0.1",
    },
});
