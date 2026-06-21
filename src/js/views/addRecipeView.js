import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fraction.js';

class AddRecipeView {
  #parentElement = document.querySelector('.upload');
  #data;
  #errorMessage = "Couldn't find the recipe, Try Again!";
  #message = 'Recipe was created successfully';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _buttonOpen = document.querySelector('.nav__btn--add-recipe');
  _buttonClose = document.querySelector('.btn--close-modal');

  constructor() {
    this.addHandlerShowWindow();
  }

  renderSpinner() {
    this.#clear();
    this.#parentElement.insertAdjacentHTML(
      `afterbegin`,
      `
          <div class="spinner">
          <svg>
              <use href="${icons}#icon-loader"></use>
          </svg>
          </div>
      `,
    );
  }

  renderMessage(message = this.#message) {
    const markup = `
        <div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
      `;

    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  addHandlerShowWindow() {
    this._buttonOpen.addEventListener('click', this.toggleWindow.bind(this));
    this._buttonClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this.#parentElement.addEventListener('submit', e => {
      e.preventDefault();

      const formData = Object.fromEntries(new FormData(e.target).entries());

      handler(formData);
    });
  }

  render(data) {
    this.#data = data;
    const markup = this.#generateMarkup();

    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this.#data = data;
    const newMarkup = this.#generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = newDOM.querySelectorAll('*');
    const currentElements = this.#parentElement.querySelectorAll('*');

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

  toLoadingState() {
    this.#clear();
    this.#parentElement.insertAdjacentHTML(
      `afterbegin`,
      `
        <div class="spinner">
        <svg>
            <use href="${icons}#icon-loader"></use>
        </svg>
        </div>
    `,
    );
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

    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  #clear() {
    this.#parentElement.innerHTML = '';
  }

  #generateMarkup() {
    const html = `
        
    `;

    return html;
  }
}

export default new AddRecipeView();
