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
    if (this.flicksStr != null && this.flicksStr.length > 2) { // Counts brackets
      while (this.flicksStr.indexOf('"id":') > 0) {
        const idIndex = this.flicksStr.indexOf('"id":') + 5
        const nameIndex = this.flicksStr.indexOf('"name":') + 8
        const faveIndex = this.flicksStr.indexOf('"fave":') + 7
        const fId1 = this.flicksStr.substring(idIndex, this.flicksStr.indexOf(',', idIndex))
        const fName = this.flicksStr.substring(nameIndex, this.flicksStr.indexOf(',', nameIndex) - 1)
        const fFave1 = this.flicksStr.substring(faveIndex, this.flicksStr.indexOf('}', faveIndex))
        let fId = parseInt(fId1)
        let fFave = false
        if (fFave1.indexOf('u') > 0) {
          fFave = true
        }

        const flick = {
          id: fId,
          name: fName,
          fave: fFave,
        }
        const li = this.renderListItem(flick)
        if (flick.fave === true) {
          li.style.backgroundColor = 'yellow'
          const starBtn = li.childNodes[1] // [text, star, x, down, up]
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
        this.flicksStr = this.flicksStr.substring(faveIndex)
      }
      const children = this.list.childNodes
      const lastNode = children[children.length - 1]
      this.max = this.findFlickObj(lastNode.id).id
    }
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
    if (form.flickName.value.length === 0) {
      return
    }
    const flick = {
      id: this.max + 1,
      name: form.flickName.value, // === the value from form > input with the name "flickName"
      fave: false
    }
    const li = this.renderListItem(flick)
    this.list.appendChild(li)
    this.flicks.push(flick)
    this.max++
    localStorage.setItem('flickArr', JSON.stringify(this.flicks))
  },

  faveFlick(ev) {
    ev.preventDefault()
    const btn = ev.target
    const movieName = btn.id.substring(btn.id.indexOf(':') + 1)
    const li = document.getElementById(movieName)
    const thisFlick = this.findFlickObj(movieName)
    if (btn.value === 'false') {
      li.style.backgroundColor = 'yellow'
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
}

app.init({
  formSelector: '#flickForm',
  listSelector: '#flickList',
})