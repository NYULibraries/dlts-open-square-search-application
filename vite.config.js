import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
    base: "/search/",
    server: {
        port: 5173,
        host: "127.0.0.1",
    },
    css: {
        preprocessorOptions: {
            scss: {
                quietDeps: true,
            },
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
