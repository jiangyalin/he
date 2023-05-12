// 创建自定义面板，同一个插件可以创建多个自定义面板
// 几个参数依次为：panel标题、图标（其实设置了也没地方显示）、要加载的页面、加载成功后的回调
chrome.devtools.panels.create('MyPanel', 'icon.png', 'mypanel.html', panel => {
  console.log('自定义面板创建成功！') // 注意这个log一般看不到
})

chrome.devtools.network.onRequestFinished.addListener(function (request) {
  request.getContent(function (content) {
    if (request.request.url.indexOf('http://192.168.3.4:8010/api') === -1) return false
    if (request.request.method === 'OPTIONS') return false
    chrome.runtime.sendMessage({
      name: 'panel',
      tabId: chrome.devtools.inspectedWindow.tabId,
      content: {
        url: request.request.url,
        content: content,
        request
      }
    })
  })
})