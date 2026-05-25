const { devices } = require('@playwright/test');

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  testDir: '../../src/test',
  globalSetup : require.resolve('./global-setup'),
  globalTeardown : require.resolve('./global-teardown'),
  workers : 5,
  timeout: 60000,
  use:{
    viewport: null,
    baseURL: 'http://localhost:3000'
  },
  projects: [
    // -- BrowserStack Projects --
    // name should be of the format browser@browser_version:os os_version@browserstack
    {
      name: 'chrome@latest:Windows 10@browserstack',
      use: {
        browserName: 'chromium',
        channel: 'chrome'
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
        browserName: 'chromium'
      },
    },
    {
      name: 'playwright-firefox@latest:Windows 11@browserstack',
      use: {
        browserName: 'firefox',
        ignoreHTTPSErrors: true
      },
    },
    {
      name: 'edge@latest-1:Windows 11@browserstack',
      use: {
        browserName: 'chromium',
       
      },
    },
  ],
};
module.exports = config;
