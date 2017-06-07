const app = {
  init(selectors) {
    this.max = 0
    this.list = document.querySelector(selectors.listSelector)
    document
      .querySelector(selectors.formSelector)
      .addEventListener('submit', this.addFlick.bind(this)) // this is an event listener (before binding)
  },

  addFlick(ev) {
    ev.preventDefault()
    const form = ev.target
    const flick = {
      id: this.max + 1,
      name: form.flickName.value, // === the value from form > input with the name "flickName"
    }
    const li = this.renderListItem(flick)
    this.list.appendChild(li)
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