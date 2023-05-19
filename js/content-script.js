const boxDom = () => {
  return `
<div class="m-box">
  <p class="u-btn j-website-btn" type="button">站</p>
  <p class="u-btn j-web-page-btn" type="button">页</p>
</div>
`
}

const checkWhitelistWebsite = () => window.localStorage.getItem('be-whitelist-website') === 'true'
const checkWhitelistWebPage = () => window.localStorage.getItem('be-whitelist-web-page') === 'true'
const checkWhitelist = () => checkWhitelistWebsite() || checkWhitelistWebPage()

const translate = () => {
  const dom = $('body').html()
  const data = dom.split('>').filter(item => item !== '').map(item => item + '>')
  const arr = []
  data.forEach(item => {
    arr.push(...item.split('<').filter(item => item !== '').map(item => item.includes('>') ? '<' + item : item))
  })
  const newDom = []
  arr.forEach((item, index) => {
    const isScript = (arr[index - 1] || '').includes('script') && (arr[index + 1] || '').includes('script')
    if (item.includes('<') || !item.replace(/(^\s*)|(\s*$)/g, '') || isScript) {
      newDom.push(item)
    } else {
      newDom.push('这是测试数据')
    }
  })
  $('body').html(newDom.join(''))
}

// 创建VDom类
class VDom {
  constructor (tag, data, value, type) {
    this.tag = tag && tag.toLowerCase() // 节点名
    this.data = data // 属性
    this.value = value // 文本数据
    this.type = type // 节点类型
    this.children = []
  }

  appendChild (vnode) {
    this.children.push(vnode)
  }
}

function getVNode (node) {
  let nodeType = node.nodeType
  let _vnode = null
  if (nodeType === 1) {
    // 元素
    let tag = node.nodeName
    let attrs = node.attributes
    let _attrObj = {}
    for (let i = 0; i < attrs.length; i++) {
      _attrObj[attrs[i].nodeName] = attrs[i].nodeValue
    }
    _vnode = new VDom(tag, _attrObj, undefined, nodeType)

    let children = node.childNodes
    for (let i = 0; i < children.length; i++) {
      _vnode.appendChild(getVNode(children[i]))
    }
  } else if (nodeType === 3) {
    // 文本
    _vnode = new VDom(node.nodeName, undefined, node.nodeValue, nodeType)
  }
  return _vnode
}

function parseVNode (vnode) {
  let type = vnode.type
  let rdom = null
  if (type === 1) {
    rdom = document.createElement(vnode.tag)
    // 元素
    let attrs = vnode.data
    for (let key in attrs) {
      rdom.setAttribute(key, attrs[key])
    }
    let children = vnode.children
    for (let i = 0; i < children.length; i++) {
      rdom.appendChild(parseVNode(children[i]))
    }
  } else if (type === 3) {
    // 文本
    rdom = document.createTextNode(vnode.value)
  }
  return rdom
}

function encryption (vNode, propTag = '') {
  const tags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'a', 'i', 'strong']
  let value = vNode.value
  const data = vNode.data || {}
  if (tags.includes(propTag) && vNode.tag === '#text') value = '这是测试数据'
  if (vNode.tag === 'body') data['data-body-mack'] = true
  if (tags.includes(propTag)) {
    data['be-text'] = vNode.children.filter(item => item).map(item => item.value).join('∞∞')
  }
  return {
    ...vNode,
    data,
    value,
    children: vNode.children.filter(item => item).map(item => encryption(item, vNode.tag))
  }
}

const init = () => {
}

window.onload = function () {
}
