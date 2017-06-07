const app = {
  init(formSelector) {
    document
      .querySelector(formSelector)
      .addEventListener('submit', this.addFlick)
  },

  addFlick(ev) {
    ev.preventDefault()
    const flickName = ev.target.flickName.value
      // ev.target == the form
      // ev.target.flickName == the input with the name "flickName"
    console.log(ev.target.flickName)
  },
}

app.init('#flickForm')