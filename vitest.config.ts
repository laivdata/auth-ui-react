import { defineConfig } from 'vitest/config';
import * as path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    // renderHook + useLoginForm 직접 시 vitest가 종료되지 않는 알려진 이슈로 제외.
    // useLoginForm 동작은 LoginForm.spec.tsx, LoginFormCustom.spec.tsx에서 간접 검증됨.
    exclude: ['**/useLoginForm.spec.ts'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
