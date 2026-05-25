const { devices } = require('@playwright/test');

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  testDir: '../../src/test',
  workers : 10,
  timeout: 60000,
  use:{
    viewport: null,
    baseURL: 'https://bstackdemo.com'
  },
  projects: [
    // -- BrowserStack Projects --
    // name should be of the format browser@browser_version:os os_version@browserstack
    {
      name: 'chrome@latest:Windows 10@browserstack',
      use: {
        browserName: 'chromium',
        channel: 'chrome',
        
      },
    },
    {
      name: 'chrome@latest-beta:Windows 10@browserstack',
      use: {
        browserName: 'chromium',
        channel: 'chrome',
      },
    },
    {
      name: 'edge@90:Windows 10@browserstack',
      use: {
        browserName: 'chromium',
      },
    },
    {
      name: 'playwright-firefox@latest:Windows 10@browserstack',
      use: {
        browserName: 'firefox',
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: 'playwright-webkit@latest:OSX Monterey@browserstack',
      use: {
        browserName: 'webkit',
        // Config to use playwright emulated devices.
        // ...devices['iPhone 12 Pro Max'],
      },
    },
  ],
};
module.exports = config;
