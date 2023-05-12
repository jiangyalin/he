//-------------------- 右键菜单演示 ------------------------//
chrome.contextMenus.create({
  title: '测试右键菜单',
  onclick: (e, a, b) => {
    chrome.notifications.create(null, {
      type: 'basic',
      iconUrl: 'icon.png',
      title: '这是标题',
      message: '您刚才点击了自定义右键菜单！'
    })
  }
})

console.log('w', chrome.webRequest) // onBeforeSendHeaders

const callback = function (details, areaName) {
  // console.log('changeObj', changeObj.requestList)
  // console.log('areaName', areaName)
  if (details.statusCode === 200) {
    console.log('details', details)
  }
  return {
    requestHeaders: details.requestHeaders
  }
}

const filters = {
  urls: ['https://192.168.3.104:7077/*', 'http://192.168.3.104:7077/*']
}

// chrome.storage.onChanged.addListener(callback)
// chrome.webRequest.onResponseStarted.addListener(callback, filters)

const list = []

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('request.content', request.content)
  const url = request.content.url
  const content = JSON.parse(request.content.content || '{}')
  if (!list.find(item => item.url === url)) {
    list.push({
      url,
      content: content
    })
  } else {
    list.find(item => item.url === url).content = content
  }
  chrome.storage.local.set({ list })
  chrome.storage.local.get('list', function (res) {
    console.log('res', res)
  })
})