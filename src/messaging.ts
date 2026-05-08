import browser from 'webextension-polyfill';

type OpenOptionsPageMessage = {
  type: 'openOptionsPage';
  data: {
    page: string;
    state: string;
  };
};

type Message = OpenOptionsPageMessage;

export function sendMessage(message: Message): Promise<unknown> {
  return browser.runtime.sendMessage(message);
}

export function addMessageListener(
  listener: (message: Message) => void | Promise<void>
): void {
  browser.runtime.onMessage.addListener((raw) => {
    listener(raw as Message);
  });
}
