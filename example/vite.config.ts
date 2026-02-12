import { defineConfig, type ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

// 워크스페이스 패키지 소스 직접 참조 (CJS dist 대신) → ESM 번들 정상 동작
const authUiReactSrc = resolve(__dirname, '../src/index.ts');
// 스타일은 소스 CSS 직접 참조 (빌드 없이 예제 실행 가능)
const authUiReactStyles = resolve(__dirname, '../src/styles/auth-ui.css');

// SSL: 인증 서버와 동일한 ssl/ 디렉터리 사용 (로컬 laivdata 도메인, 루트 기준)
const sslDir = resolve(__dirname, '../../../ssl');
const keyPath = resolve(sslDir, 'laivdata-key.pem');
const certPath = resolve(sslDir, 'laivdata-cert.pem');
const httpsEnabled =
  process.env.VITE_DEV_HTTPS === 'true' &&
  fs.existsSync(keyPath) &&
  fs.existsSync(certPath);
const httpsConfig = httpsEnabled
  ? {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    }
  : undefined;

// HTTPS 시 sample-local.laivdata.com으로 바인딩 → Vite가 이 주소를 Local에 출력하고, 해당 주소로만 접속 가능
const SAMPLE_HTTPS_HOST = 'sample-local.laivdata.com';

const sampleHttpsPlugin =
  httpsConfig &&
  (() => ({
    name: 'sample-https-url',
    configureServer(server: ViteDevServer) {
      server.httpServer?.once('listening', () => {
        const logger = server.config.logger;
        logger.info('');
        logger.info(`  📌 예제 페이지(HTTPS): https://${SAMPLE_HTTPS_HOST}:5173`, { clear: false });
        logger.info('     인증 서버: https://auth-local.laivdata.com:3000', { clear: false });
        logger.info('     접속이 안 되면 /etc/hosts에 등록: sudo ./scripts/setup-hosts.sh', { clear: false });
        logger.info('');
      });
    },
  }));

export default defineConfig({
  plugins: [react(), ...(sampleHttpsPlugin ? [sampleHttpsPlugin()] : [])],
  resolve: {
    alias: [
      // 구체적인 경로를 먼저 매칭 (CSS가 index.ts로 해석되지 않도록)
      { find: '@laivdata/auth-ui-react/styles.css', replacement: authUiReactStyles },
      { find: '@laivdata/auth-ui-react', replacement: authUiReactSrc },
      { find: '@', replacement: resolve(__dirname, './src') },
    ],
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  server: {
    port: 5173,
    // HTTPS일 때 예제 전용 도메인으로 바인딩 → Local에 https://sample-local.laivdata.com:5173 표시, 해당 주소로만 접속
    host: httpsConfig ? SAMPLE_HTTPS_HOST : true,
    https: httpsConfig,
    proxy: {
      // 인증 서버가 다른 포트일 때 API 프록시 (선택)
      // '/api': { target: 'http://localhost:3000', changeOrigin: true },
    },
  },
});
