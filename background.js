// let color = '#3aa757';
chrome.runtime.onInstalled.addListener(() => {
  console.log('service worker loaded');
  // chrome.storage.sync.set({ color });
});