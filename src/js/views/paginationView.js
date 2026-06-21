import icons from 'url:../../../src/img/icons.svg';

class PaginationView {
  #parentElement = document.querySelector('.pagination');
  #data;
  #errorMessage = 'Could not find the results';

  addPaginationHandlers(handler) {
    this.#parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline');
      if (!btn);
      const gotoPage = Number.parseInt(btn.dataset.goto);
      handler(gotoPage);
    });
  }

  render(data) {
    if (
      !data ||
      (Array.isArray(data.recipesList) && data.recipesList.length === 0)
    ) {
      return this.renderError();
    }
    this.#data = data;
    const markup = this.#generateMarkup();

    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  #clear() {
    this.#parentElement.innerHTML = '';
  }

  #generateMarkup() {
    const page = this.#data.page;
    const numPages = Math.ceil(
      this.#data.recipesList.length / this.#data.limit,
    );
    // Page 1, no other pages
    if (page === 1 && numPages === 1) {
      return '';
    }
    // Page 1, other pages
    if (page === 1 && numPages > 1) {
      return `
        <button class="btn--inline pagination__btn--next" data-goto="${page + 1}">
          <span>Page ${page + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `;
    }
    // Last Page
    if (page >= numPages && numPages > 1) {
      return `
        <button class="btn--inline pagination__btn--prev" data-goto="${page - 1}">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${page - 1}</span>
        </button>
      `;
    }
    // Other Page
    if (page < numPages && numPages > 1) {
      return `
      <button class="btn--inline pagination__btn--prev" data-goto="${page - 1}">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${page - 1}</span>
          </button>
          <button class="btn--inline pagination__btn--next" data-goto="${page + 1}">
            <span>Page ${page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
      </button>
      `;
    }
  }

  renderError(message = this.#errorMessage) {
    const markup = ``;

    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}

export default new PaginationView();
