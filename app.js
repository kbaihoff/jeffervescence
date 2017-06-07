const app = {
  init(selectors) {
    // this is the app object
    this.max = 0
    this.list = document.querySelector(selectors.listSelector)
    this.flicks = []
    // this is an event listener (before binding)
    document
      .querySelector(selectors.formSelector)
      .addEventListener('submit', this.addFlick.bind(this))
  },

  makeStarBtn(name) {
    const btn = document.createElement('button')
    const star = document.createTextNode('\u2606')
    btn.id = 'star:' + name
    btn.className = 'star'
    btn.value = false
    btn.addEventListener('click', this.faveFlick.bind(this))
    btn.appendChild(star)
    return btn
  },

  makeUpBtn(name) {
    const btn = document.createElement('button')
    const up = document.createTextNode('\u25b2')
    btn.id = 'up:' + name
    btn.className = 'up'
    btn.addEventListener('click', this.moveFlick.bind(this))
    btn.appendChild(up)
    return btn
  },

  makeDownBtn(name) {
    const btn = document.createElement('button')
    const down = document.createTextNode('\u25bc')
    btn.id = 'down:' + name
    btn.className = 'down'
    btn.addEventListener('click', this.moveFlick.bind(this))
    btn.appendChild(down)
    return btn
  },

  makeXBtn(name) {
    const btn = document.createElement('button')
    const x = document.createTextNode('\u2612')
    btn.id = 'x:' + name
    btn.className = 'x'
    btn.addEventListener('click', this.deleteFlick.bind(this))
    btn.appendChild(x)
    return btn
  },

  renderListItem(flick) {
    const name = flick.name
    const li = document.createElement('li')
    const starBtn = this.makeStarBtn(name)
    const upBtn = this.makeUpBtn(name)
    const downBtn = this.makeDownBtn(name)
    const xBtn = this.makeXBtn(name)
    li.textContent = name
    li.id = name
    li.appendChild(starBtn)
    li.appendChild(xBtn)
    li.appendChild(downBtn)
    li.appendChild(upBtn)
    return li
  },

  addFlick(ev) {
    ev.preventDefault()
    const form = ev.target
    // this is the app object
    const flick = {
      id: this.max + 1,
      name: form.flickName.value, // === the value from form > input with the name "flickName"
    }
    const li = this.renderListItem(flick)
    this.list.appendChild(li)
    this.flicks.push(flick)
    this.max++
  },

  faveFlick(ev) {
    ev.preventDefault()
    const btn = ev.target
    const movieName = btn.id.substring(btn.id.indexOf(':') + 1)
    const li = document.getElementById(movieName)
    if (btn.value === 'false') {
      li.style.backgroundColor = 'yellow'
      btn.value = true
    }
    else if (btn.value === 'true') {
      li.style.backgroundColor = '#F5F5DC'
      btn.value = false
    }
  },

  moveFlick(ev) {
    ev.preventDefault()
    const btn = ev.target
    const upOrDown = btn.id.substring(0, btn.id.indexOf(':'))
    const movieName = btn.id.substring(btn.id.indexOf(':') + 1)
    const thisItem = btn.parentElement
    const nextItem = thisItem.nextSibling
    const prevItem = thisItem.previousSibling
    if (upOrDown === 'up' && prevItem != null) {
      this.list.insertBefore(thisItem, prevItem)
      // parentNode.insertBefore(childToMove, childToPrecede)
    }
    else if (upOrDown === 'down' && nextItem != null) {
      this.list.insertBefore(nextItem, thisItem)
    }
  },

  deleteFlick(ev) {
    ev.preventDefault()
    const btn = ev.target
    const movieName = btn.id.substring(btn.id.indexOf(':') + 1)
    const li = document.getElementById(movieName)
    li.remove()
  },
}

app.init({
  formSelector: '#flickForm',
  listSelector: '#flickList',
})