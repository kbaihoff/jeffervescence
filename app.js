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

  renderListItem(flick) {
    const li = document.createElement('li')
    li.textContent = flick.name
    return li
  },
}

app.init({
  formSelector: '#flickForm',
  listSelector: '#flickList',
})