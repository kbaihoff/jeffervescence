class App {
  constructor(selectors) {
    this.flicks = []
    this.max = 0
    this.list = document.querySelector(selectors.listSelector)
    this.template = document.querySelector(selectors.templateSelector)
    document
      .querySelector(selectors.formSelector)
      .addEventListener('submit', this.addFlickViaForm.bind(this))
    this.load()
  }

  load() {
    // Get the JSON string out of localStorage
    const flicksJSON = localStorage.getItem('flicks')
    // Turn that into an array
    const flicksArray = JSON.parse(flicksJSON)
    // Set this.flicks to that array
    if (flicksArray) {
      flicksArray
        .reverse()
        .map(this.addFlick.bind(this))
    }
  }

  addFlick(flick) {
    const listItem = this.renderListItem(flick)
    this.list.insertBefore(listItem, this.list.firstChild)
    if (flick.id > this.max) {
      this.max = flick.id + 1
    }
    this.flicks.unshift(flick)
    this.save()
  }

  addFlickViaForm(ev) {
    ev.preventDefault()
    const f = ev.target
    const flick = {
      id: this.max + 1,
      name: f.flickName.value,
      fav: false,
    }
    this.addFlick(flick)
    f.reset()
  }

  save() {
    localStorage.setItem('flicks', JSON.stringify(this.flicks))
  }

  renderListItem(flick) {
    const item = this.template.cloneNode(true)
    item.classList.remove('template') // This applied visibility rule in CSS, and now it's not a template anymore; there's a real object
    item.dataset.id = flick.id
    item
      .querySelector('.flick-name')
      .textContent = flick.name
    
    item
      .querySelector('.flick-name')
      .setAttribute('title', flick.name)
    
    if (flick.fav) { // We need to decide to add that class when building the list item
      item.classList.add('fav')
    }
    
    // this calls removeFlick, so "this" is the event target in removeFlick (before binding)
    item
      .querySelector('button.remove')
      .addEventListener('click', this.removeFlick.bind(this))
    
    // will pass the event and 'flick' as arguments to favFlick (Object, MouseEvent)
    item
      .querySelector('button.fav')
      .addEventListener('click', this.favFlick.bind(this, flick))
    
    item
      .querySelector('button.move-up')
      .addEventListener('click', this.moveUp.bind(this, flick))
    
    item
      .querySelector('button.move-down')
      .addEventListener('click', this.moveDown.bind(this, flick))

    item
      .querySelector('button.edit')
      .addEventListener('click', this.edit.bind(this, flick))
    
    item
      .querySelector('.flick-name')
      .addEventListener('keypress', this.saveOnEnter.bind(this, flick))

    return item
  }

  removeFlick(ev) {
    const listItem = ev.target.closest('.flick')
    // Find the flick in the array, and remove it
    for (let i = 0; i < this.flicks.length; i++) {
      const currentId = this.flicks[i].id.toString()
      if (listItem.dataset.id === currentId) {
        this.flicks.splice(i, 1)
        break
      }
    }
    listItem.remove()
    this.save()
  }

  favFlick(flick, ev) {
    const listItem = ev.target.closest('.flick')
    listItem.classList.toggle('fav')
    flick.fav = !(flick.fav)
    this.save()
  }

  moveUp(flick, ev) {
    const listItem = ev.target.closest('.flick')
    const index = this.flicks.findIndex((currentFlick, i) => {
      // Run this function until it returns true; returns -1 if not there; returns 0 if first thing
      // Inner function itself will return a boolean
      // findIndex will return an index when the inner function returns true
      return currentFlick.id === flick.id
    })
    if (index > 0) {
      this.list.insertBefore(listItem, listItem.previousElementSibling)
      const previousFlick = this.flicks[index - 1]
      this.flicks[index - 1] = flick
      this.flicks[index] = previousFlick
      this.save()
    }
  }

  moveDown(flick, ev) {
    const listItem = ev.target.closest('.flick')
    const index = this.flicks.findIndex((currentFlick, i) => {
      return currentFlick.id === flick.id
    })
    if (index < this.flicks.length - 1) {
      this.list.insertBefore(listItem.nextElementSibling, listItem)
      const nextFlick = this.flicks[index + 1]
      this.flicks[index + 1] = flick
      this.flicks[index] =  nextFlick
      this.save()
    }
  }

  edit(flick, ev) {
    const listItem = ev.target.closest('.flick')
    const nameField = listItem.querySelector('.flick-name')
    const btn = listItem.querySelector('.edit.button')
    const icon = btn.querySelector('i.fa')
    if (nameField.isContentEditable) {
      // make it no longer editable, save changes
      nameField.contentEditable = false
      icon.classList.remove('fa-check')
      icon.classList.add('fa-pencil')
      btn.classList.remove('success')
      flick.name = nameField.textContent
      this.save()
    }
    else {
      nameField.contentEditable = true
      nameField.focus()
      icon.classList.remove('fa-pencil')
      icon.classList.add('fa-check')
      btn.classList.add('success')
    }
  }

  saveOnEnter(flick, ev) {
    if (ev.key === "Enter") {
      ev.preventDefault()
      this.edit(flick, ev)
    }
  }
}

const app = new App({
  formSelector: '#flick-form',
  listSelector: '#flick-list',
  templateSelector: '.flick.template', // 2 classes
})