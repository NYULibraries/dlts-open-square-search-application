// this config file is just to test the backups by proxying the request to any resource that we don't have to the opensquare site
import { defineConfig } from "vite";
export default defineConfig({
    base: "/search/",
    server: {
        port: 5173,
        host: "127.0.0.1",
    },
    preview: {
        port: 4173,
        proxy: {
            "/css": {
                target: "https://opensquare.com",
                changeOrigin: true,
                secure: false,
            },
            // "/images/opensquare_logo.svg": {
            //     target: "https://opensquare.com",
            //     changeOrigin: true,
            //     secure: false,
            // },
            // "/images/NYUPLogo.png": {
            //     target: "https://opensquare.com",
            //     changeOrigin: true,
            //     secure: false,
            // },
            "/images": {
                target: "https://opensquare.com",
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
