import browser from 'webextension-polyfill';
import { setPendingOptionsPageTask } from '../pendingOptionsPageTask';
import { addMessageListener } from '../messaging';

(browser.browserAction || browser.action).onClicked.addListener(() => {
  browser.runtime.openOptionsPage();
});

addMessageListener(async (message) => {
  if (message.type === 'openOptionsPage') {
    await setPendingOptionsPageTask(message.data);
    browser.tabs.create({
      url: browser.runtime.getURL('src/options/options.html')
    });
  }
});
