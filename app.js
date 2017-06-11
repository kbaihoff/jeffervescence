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
        
    this.flicksStr = localStorage.getItem('flickArr')
    this.reFlick = JSON.parse(this.flicksStr)
    for (let i = 0; i < this.reFlick.length; i++) {
      const flick = this.reFlick[i]
      const li = this.renderListItem(flick)
      if (flick.fave === true) {
        li.style.backgroundColor = '#FFC300'
        const starBtn = li.childNodes[0] // [star, edit, text span, x, down, up]
        starBtn.value = true
      }
      this.list.appendChild(li)
      let prevItem = li.previousSibling
      if (prevItem != null) {
        let prevFlickObj = this.findFlickObj(prevItem.id)
        while (prevFlickObj != null && prevFlickObj.id > flick.id) {
          this.list.insertBefore(li, prevItem)
          if (li.previousSibling === null) {
            break
          }
          prevFlickObj = this.findFlickObj(li.previousSibling.id)
          prevItem = li.previousSibling
        }
      }
      this.flicks.push(flick)
    }
    const children = this.list.childNodes
    if (children.length > 0) {
      const lastNode = children[children.length - 1]
      this.max = this.findFlickObj(lastNode.id).id
    }
  },

  makeStarBtn(name) {
    const btn = document.createElement('button')
    const star = document.createTextNode('\u265a')
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
    const x = document.createTextNode('\u2718')
    btn.id = 'x:' + name
    btn.className = 'x'
    btn.addEventListener('click', this.deleteFlick.bind(this))
    btn.appendChild(x)
    return btn
  },

  renderListItem(flick) {
    const name = flick.name
    const span = document.createElement('span')
    const text = document.createTextNode(name)
    const editBtn = document.createElement('button')
    const pencil = document.createTextNode('\u270e')
    span.className = 'flickTitle'
    span.contentEditable = false

    editBtn.className = 'editPencil'
    editBtn.appendChild(pencil)
    editBtn.addEventListener('click', this.handleClick.bind(this))

    span.appendChild(text)
    span.addEventListener('keydown', this.handleEnter.bind(this))

    const li = document.createElement('li')
    const starBtn = this.makeStarBtn(name)
    const upBtn = this.makeUpBtn(name)
    const downBtn = this.makeDownBtn(name)
    const xBtn = this.makeXBtn(name)
    li.id = name
    li.appendChild(starBtn)
    li.appendChild(editBtn)
    li.appendChild(span)
    li.appendChild(xBtn)
    li.appendChild(downBtn)
    li.appendChild(upBtn)
    return li
  },

  addFlick(ev) {
    ev.preventDefault()
    const form = ev.target
    if (isNaN(form.flickYear.value) === true) {
      alert("Please enter the year as a number")
      return
    }
    // this is the app object
    const flick = {
      id: this.max + 1,
      name: form.flickName.value, // === the value from form > input with the name "flickName"
      fave: false,
      year: parseInt(form.flickYear.value),
    }
    const li = this.renderListItem(flick)
    this.list.appendChild(li)
    this.flicks.push(flick)
    this.max++
    form.reset()
    localStorage.setItem('flickArr', JSON.stringify(this.flicks))
  },

  faveFlick(ev) {
    ev.preventDefault()
    const btn = ev.target
    const movieName = btn.id.substring(btn.id.indexOf(':') + 1)
    const li = document.getElementById(movieName)
    const thisFlick = this.findFlickObj(movieName)
    if (btn.value === 'false') {
      li.style.backgroundColor = '#FFC300'
      btn.value = true
      thisFlick.fave = true
    }
    else if (btn.value === 'true') {
      li.style.backgroundColor = '#F5F5DC'
      btn.value = false
      thisFlick.fave = false
    }
    localStorage.setItem('flickArr', JSON.stringify(this.flicks))
  },

  switchIndexes(flick1, flick2) {
    const temp = flick1.id
    flick1.id = flick2.id
    flick2.id = temp
    return
  },

  findFlickObj(flickName) {
    for (let i = 0; i < this.flicks.length; i++) {
      const flickInArray = this.flicks[i]
      if (flickInArray.name === flickName) {
        return flickInArray
      }
    }
  },

  moveFlick(ev) {
    ev.preventDefault()
    const btn = ev.target
    const upOrDown = btn.id.substring(0, btn.id.indexOf(':'))
    const thisItem = btn.parentElement
    const thisName = btn.id.substring(btn.id.indexOf(':') + 1)
    const thisFlick = this.findFlickObj(thisName)
    const nextItem = thisItem.nextSibling
    const prevItem = thisItem.previousSibling
    if (upOrDown === 'up' && prevItem != null) {
      this.list.insertBefore(thisItem, prevItem)
      const prevFlick = this.findFlickObj(prevItem.id)
      this.switchIndexes(thisFlick, prevFlick)
    }
    else if (upOrDown === 'down' && nextItem != null) {
      this.list.insertBefore(nextItem, thisItem)
      const nextFlick = this.findFlickObj(nextItem.id)
      this.switchIndexes(nextFlick, thisFlick)
    }
    localStorage.setItem('flickArr', JSON.stringify(this.flicks))
  },

  deleteFlick(ev) {
    ev.preventDefault()
    const btn = ev.target
    const movieName = btn.id.substring(btn.id.indexOf(':') + 1)
    const li = document.getElementById(movieName)
    li.remove()
    const thisFlick = this.findFlickObj(movieName)
    let arrIndex = 0
    for (arrIndex = 0; arrIndex < this.flicks.length; arrIndex++) {
      const flickInArray = this.flicks[arrIndex]
      if (flickInArray.name === movieName) {
        break
      }
    }
    this.flicks.splice(arrIndex, 1)
    localStorage.setItem('flickArr', JSON.stringify(this.flicks))
  },

  save(span) {
    const newName = span.innerText
    const thisFlick = this.findFlickObj(span.parentElement.id)
    thisFlick.name = newName
    const children = span.parentElement.childNodes // [star, edit, span, x, down, up]
    span.parentElement.id = newName
    children[0].id = 'star:' + newName
    children[3].id = 'x:' + newName
    children[4].id = 'down:' + newName
    children[5].id = 'up:' + newName
    span.contentEditable = false
    localStorage.setItem('flickArr', JSON.stringify(this.flicks))
  },

  getSpan(ev) {
    const span = ev.target
    this.save(span)
  },

  handleClick(ev) {
    const span =  ev.target.parentElement.childNodes[2]
    span.contentEditable = true
    span.focus()
    span.addEventListener('blur', this.getSpan.bind(this))
  },

  handleEnter(ev) {
    const span = ev.target
    if (ev.keyCode === 13) { // enter key === 13
      ev.preventDefault()
      this.save(span)
    }
  },
}

app.init({
  formSelector: '#flickForm',
  listSelector: '#flickList',
})