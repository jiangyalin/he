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

const filters = {
  urls: ['https://192.168.3.104:7077/*', 'http://192.168.3.104:7077/*']
}

const list = []

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // console.log('request.content', request.content)
  const url = request.content.url
  const content = JSON.parse(request.content.content || '{}')
  const query = {}
  request.content.request.request.queryString.forEach(item => {
    query[item.name] = item.value
  })
  const headers = {}
  headers.Authorization = request.content.request.request.headers.find(item => item.name === 'Authorization')?.value || ''
  const _request = {
    query: query,
    headers: headers,
    method: request.content.request.request.method
  }
  if (!list.find(item => item.url === url)) {
    list.push({
      url,
      content: content,
      request: _request
    })
  } else {
    list.find(item => item.url === url).content = content
    list.find(item => item.url === url).request = _request
  }
  chrome.storage.local.set({ list })
  // chrome.storage.local.get('list', function (res) {
  //   console.log('res', res)
  // })
})