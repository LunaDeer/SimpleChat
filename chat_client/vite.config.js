import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        // 配置路径别名
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    base: '/chat/',

    plugins: [vue()],
    // define: {
    //     'process.env': {}
    // },
    server: {
        // 是否自动打开浏览器
        open: true,
        // 服务器主机名，如果允许外部访问，可设置为"0.0.0.0"
        host: '0.0.0.0',
        // 服务器端口号
        port: 1234,
        // 设为 true ,若端口已被占用则会直接退出，而不是尝试下一个可用端口
        // strictPort: false,
        // 为开发服务器配置 CORS
        // cors: true,
        // 设置为 true 强制使依赖预构建
        // force: true,
        // 代理
        // proxy: {
        //     '/api':
        //     {
        //         target: 'http://127.0.0.1',
        //         changeOrigin: true,
        //         rewrite:
        //             (path) => path.replace(/^\/api/, '')
        //     }
        // }
    }
})
