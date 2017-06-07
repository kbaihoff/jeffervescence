const app = {
  init(formSelector) {
    this.max = 0
    document
      .querySelector(formSelector)
      .addEventListener('submit', this.addFlick.bind(this))
      // this is an event listener (before binding)
  },

  addFlick(ev) {
    ev.preventDefault()
    const form = ev.target
    const flick = {
      id: this.max + 1,
      name: form.flickName.value, // === the value from form > input with the name "flickName"
    }

    console.log(flick.name, flick.id)
    this.max++
  },
}

app.init('#flickForm')