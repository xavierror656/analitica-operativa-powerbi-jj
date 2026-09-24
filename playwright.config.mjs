import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser',
  timeout: 45000,
  forbidOnly: !!process.env.CI,
  workers: 2,
  globalTeardown: './tests/browser/cerrar-servidor.mjs',
  reporter: [['list'], ['html', {open:'never'}]],
  use: {
    baseURL: 'http://127.0.0.1:4321',
    headless: true,
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {name:'movil', use:{viewport:{width:390,height:844}}},
    {name:'laptop', use:{viewport:{width:1366,height:768}}},
    {name:'proyector', use:{viewport:{width:1920,height:1080}}},
  ],
  webServer: {command:'node tests/browser/servidor.mjs', url:'http://127.0.0.1:4321', reuseExistingServer:false},
});
