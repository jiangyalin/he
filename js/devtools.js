// 在页面标题中显示DevTools状态
document.title = 'DevTools Running - ' + new Date().toLocaleTimeString()

let filter = '@'
let requestCount = 0

const analyzePaneFilter = () => {
  chrome.storage.local.get(['filter'], function (result) {
    if (result.filter) {
      filter = result.filter
      console.log('🔍 Filter updated to:', filter)
    } else {
      console.log('🔍 No filter found, using default:', filter)
    }
  })
}

analyzePaneFilter()

chrome.devtools.network.onRequestFinished.addListener(function (request) {
  requestCount++

  request.getContent(function (content) {
    if (request.request.url.indexOf(filter) === -1 && filter !== '@') {
      return false
    }
    if (request.request.method === 'OPTIONS') {
      return false
    }

    chrome.runtime.sendMessage({
      name: 'panel-list',
      tabId: chrome.devtools.inspectedWindow.tabId,
      content: {
        url: request.request.url,
        content: content,
        request
      }
    }, function(response) {
      if (chrome.runtime.lastError) {
        console.error('❌ Failed to send request data:', chrome.runtime.lastError)
      } else {
        console.log('✅ Request data sent successfully')
      }
    })
  })
})
