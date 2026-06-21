import icons from 'url:../../../src/img/icons.svg';

export class SearchView {
  #data;
  #parentElement = document.querySelector('.search');
  #errorMessage = 'Search for another keyword and Try Again!';

  #searchField = this.#parentElement.querySelector('.search__field');

  #searchResultsContainer = document.querySelector('.results');

  addShowRecipesListHandlers(handler) {
    this.#parentElement.addEventListener('submit', e => {
      e.preventDefault();
      handler();
      this.#clearInput();
    });
  }

  getSearchQuery() {
    const searchQuery = this.#searchField.value;
    return searchQuery;
  }

  renderError(message = this.#errorMessage) {
    const markup = `
        <div class="error">
            <div>
            <svg>
                <use href="${icons}#icon-alert-triangle"></use>
            </svg>
            </div>
            <p>${message}</p>
        </div>
    `;
    this.#searchResultsContainer.innerHTML = '';
    this.#searchResultsContainer.insertAdjacentHTML('afterbegin', markup);
  }

  renderRecipesList(recipes) {
    this.#data = recipes;

    if (!recipes || !recipes.length) {
      this.renderError();
      return;
    }
    const html = this.#generateMarkup(recipes);
    this.#searchResultsContainer.innerHTML = '';
    this.#searchResultsContainer.insertAdjacentHTML('afterbegin', html);
  }

  update(data) {
    this.#data = data;
    const newMarkup = this.#generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = newDOM.querySelectorAll('*');
    const currentElements = this.#searchResultsContainer.querySelectorAll('*');

    for (let i = 0; i < newElements.length; i++) {
      const newEl = newElements[i];
      const curEl = currentElements[i];

      if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue?.trim?.()) {
        curEl.innerHTML = newEl.innerHTML;
      }

      Array.from(newEl.attributes).forEach(attr => {
        if (curEl.getAttribute(attr.name) !== attr.value) {
          curEl.setAttribute(attr.name, attr.value);
        }
      });
    }
  }

  #clearInput() {
    this.#searchField.value = '';
  }

  #generateMarkup() {
    if (!this.#data || !this.#data.length) return '';
    const id = window.location.hash.slice(1);
    const html = this.#data
      .map(
        recipe =>
          `
        <li class="preview">
            <a class="preview__link ${id === recipe.id ? 'preview__link--active' : ''}" href="#${recipe.id}">
                <figure class="preview__fig">
                <img src="${recipe.imageUrl}" alt="Test" />
                </figure>
                <div class="preview__data">
                <h4 class="preview__title">${recipe.title}</h4>
                <p class="preview__publisher">${recipe.publisher}</p>
                <div class="preview__user-generated ${recipe.key ? '' : 'hidden'}">
                    <svg>
                    <use href="${icons}#icon-user"></use>
                    </svg>
                </div>
                </div>
            </a>
        </li>
            `,
      )
      .join('');

    return html;
  }
}

export default new SearchView();
