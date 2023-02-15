import View from './View.js'
import icons from 'url:../../img/icons.svg' // parcel 2


class PaginationView extends View {
  _parentElement = document.querySelector('.pagination')

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline') // searches up in the tree to closest to parent

      if (!btn) return

      const goToPage = +btn.dataset.goto

      handler(goToPage)
    })
  }

  _generateMarkup() {
    const curPage = this._data.page

    // computing the pages
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage)

    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return `
      <span class="pages__amount" >RESULT: ${numPages} PAGES</span>
        <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `
    }


    // Last page 
    if (curPage === numPages && numPages > 1) {
      return `
      <span class="pages__amount" >RESULT: ${numPages} PAGES</span>
        <button data-goto="${curPage - 1}"  class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${curPage - 1}</span>
        </button>

      `
    }

    // Other page
    if (curPage < numPages) {
      return `
        <button data-goto="${curPage - 1}"  class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${curPage - 1}</span>
        </button>
        <span class="pages__amount" >RESULT: ${numPages} PAGES</span>
        <button data-goto="${curPage + 1}"  class="btn--inline pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
    `
    }

    // Page 1, and there are NO pages 
    return `
    <span class="pages__amount">No pages</span>
    `
  }

}

export default new PaginationView()