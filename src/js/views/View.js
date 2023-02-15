import icons from 'url:../../img/icons.svg' // parcel 2

export default class View {
  _data;

  // JS DOC COMMENTS 
  /**
   * Render the received object to the DOM (destriptions of parametrs @paramm)
   * @param {Object | Object[Array]} data The data to be rendered (e.g recipe)// we are expecting an object or array of objects
   * @param {boolean} [render = true] If false, create markup string instead of rendering to dom  
   * @returns {undefined | string} A markup string is returned if render is false
   * @this {object} View instance
   * @author Jonas Schmedtamnn
   * @todo Finish implementation 
   */

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError()

    this._data = data
    const markup = this._generateMarkup()

    if (!render) return markup

    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  // generating this markup and compare new html to the current html and change  attributes 
  // which has changed from old version to new version
  update(data) {

    this._data = data
    const newMarkup = this._generateMarkup()

    // will convert string to real DOM object
    const newDOM = document.createRange().createContextualFragment(newMarkup)
    const newElements = Array.from(newDOM.querySelectorAll('*'))
    const curElements = Array.from(this._parentElement.querySelectorAll('*'))

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i]

      // comparing two elements
      // console.log(curEl, newEl.isEqualNode(curEl));

      // Updates changed TEXT
      if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
        // console.log('🙌', newEl.firstChild.nodeValue.trim())
        curEl.textContent = newEl.textContent
      }

      // Updates changed ATTRIBUTE
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        )
    })
  }

  _clear() {
    this._parentElement.innerHTML = ''
  }


  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `
    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `
    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
  `
    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

} 