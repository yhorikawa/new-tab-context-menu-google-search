class ContextMenus {
  constructor() {
    this.items = {};
    this.callbacks = {};
    chrome.contextMenus.onClicked.addListener((info, tab) => {
        this.callbacks[info.menuItemId](info, tab);
    });
  }

  setItems(menuItems) {
    for (const item of menuItems) {
      this.callbacks[item.id] = item.onclick;
      item.onclick = null;
      this.items[item.id] = item;
    }
  }

  create() {
    for (const key in this.items) {
      chrome.contextMenus.create(this.items[key]);
    }
  }
}

const searchWithGoogle = (info, tab) => {
  const url = `https://www.google.com/search?q=${encodeURIComponent(info.selectionText)}`;
  chrome.tabs.create({url: url, index: tab.index + 1});
}

const contextMenus = new ContextMenus();
contextMenus.setItems([{
  id: 'searchWithGoogle',
  title: 'Googleで"%s"を検索',
  contexts: ['selection'],
  onclick: searchWithGoogle
}]);

chrome.runtime.onInstalled.addListener(() => contextMenus.create());
