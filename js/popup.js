const dom = $('.j-list')
let listData = []

dom.on('click', '.j-copy', function () {
  const api = $(this).parents('.j-li').attr('data-api')
  const item = listData.find(item => item.url === api)
  navigator.clipboard.writeText(JSON.stringify(item.content, null, 2))
})

dom.on('click', '.j-down', function () {
  const api = $(this).parents('.j-li').attr('data-api')
  const urlObj = urlToObj(api)
  const fileName = urlObj.api + '.json'
  const item = listData.find(item => item.url === api)
  funDownload(JSON.stringify(item, null, 2), fileName)
})

$('.j-refresh').click(() => {
  init()
})

window.onload = () => {
  init()
}

// 初始化
const init = () => {
  chrome.storage.local.get('list', res => {
    listData = res.list
    const listDom = res.list.map(item => {
      const urlObj = urlToObj(item.url)
      return `<li class="u-li j-li" data-api="${item.url}">
                <p class="u-name">/${urlObj.api}</p>
                <div class="u-btn-gp">
                  <button class="u-btn j-copy" type="button">复制</button>
                  <button class="u-btn j-down" type="button">下载</button>
                </div>
              </li>`
    })

    $('.j-list').html(listDom.join(''))
  })
}

const urlToObj = url => {
  const obj = {}
  const arr = url.split('?')
  obj.url = arr[0]
  obj.api = arr[0].split('/').filter((item, index) => index > 2).join('/')
  obj.params = arr[1] ? arr[1].split('&').map(item => {
    const _arr = item.split('=')
    return {
      key: _arr[0],
      value: _arr[1]
    }
  }) : []
  return obj
}

// 生成下载文件并下载
const funDownload = (content, filename) => {
  // 创建隐藏的可下载链接
  const eleLink = document.createElement('a')
  eleLink.download = filename
  eleLink.style.display = 'none'
  // 字符内容转变成blob地址
  const blob = new Blob([content])
  eleLink.href = URL.createObjectURL(blob)
  // 触发点击
  document.body.appendChild(eleLink)
  eleLink.click()
  // 然后移除
  document.body.removeChild(eleLink)
}