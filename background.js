// background.js — Service Worker for Crisp

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "openSettings") {
    chrome.runtime.openOptionsPage();
  }
});
