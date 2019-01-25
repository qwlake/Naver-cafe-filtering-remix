
function filter_writer() {
    chrome.tabs.executeScript({file: '/js/background/add_filter_writer.js'})
}

function by_nickname() {
    chrome.tabs.executeScript({file: '/js/background/add_by_nickname.js'})
}

 chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        documentUrlPatterns: ["https://cafe.naver.com/*"],
        title: '현재 글 작성자 필터링',
        type: 'normal',
        id: 'filter_this_writer',
        contexts: ['page', 'link'],
    });
    chrome.contextMenus.create({
        documentUrlPatterns: ["https://cafe.naver.com/*"],
        title: '닉네임으로 ID 등록',
        type: 'normal',
        id: 'by_nickname',
        contexts: ['page', 'link'],
    });

  });
chrome.contextMenus.onClicked.addListener(function(itemData) {
  if (itemData.menuItemId === "filter_this_writer")
      filter_writer();
  if (itemData.menuItemId === "by_nickname")
      by_nickname(itemData);
});