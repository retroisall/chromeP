chrome.runtime.onInstalled.addListener(() => {
    console.log("擴充功能已安裝！");
  });
  
  // 監聽 popup.js 的訊息請求，返回當前的標籤頁網址
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "GET_CURRENT_URL") {
      // 獲取目前活躍的標籤頁
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        if (currentTab) {
          sendResponse({ url: currentTab.url });
        } else {
          sendResponse({ url: null });
        }
      });
      return true; // 表示會異步回應
    }
  });