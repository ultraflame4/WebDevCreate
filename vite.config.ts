import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, 'src')
        }
    },
    define: {
        'APP_VERSION': JSON.stringify(process.env.npm_package_version),
    },
    assetsInclude: ["src/**/*.html"],
    base: "",

})
