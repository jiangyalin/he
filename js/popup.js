// 打开后台页
$('#open_background').click(e => {
  console.log('这是测试数据')
  window.open(chrome.extension.getURL('background.html'))
})

const getWhitelist = function () {
  return JSON.parse(window.localStorage.getItem('be-whitelist') || '{ website: [], webPage: [] }')
}

const setWhitelist = function ({ website = [], webPage = [] }) {
  return window.localStorage.setItem('be-whitelist', JSON.stringify({
    website,
    webPage
  }))
}

const init = () => {
  const checkWhitelist = window.localStorage.getItem('be-whitelist-website') === 'true' || window.localStorage.getItem('be-whitelist-web-page') === 'true'
  $('body').attr('be-whitelist', checkWhitelist)
}

console.log('333')
$('.j-website-btn').click(() => {
  console.log('111')
  const checkWhitelist = window.localStorage.getItem('be-whitelist-website') === 'true'
  window.localStorage.setItem('be-whitelist-website', !checkWhitelist)

  init()
})


$('.j-web-page-btn').click(() => {
  console.log('222')
  const checkWhitelist = window.localStorage.getItem('be-whitelist-web-page') === 'true'
  window.localStorage.setItem('be-whitelist-web-page', !checkWhitelist)

  init()
})
