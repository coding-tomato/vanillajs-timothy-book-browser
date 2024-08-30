export class BookSearchPage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const styling = /*css*/ ``;

    this.innerHTML = /*html*/ `
      <style>
        ${styling}
      </style>

      <h1>Search page</h1>

      <search-bar-component></search-bar-component></br>
      <pagination-component></pagination-component>

      </br>

      <book-list-component></book-list-component>

    `;
  }
}
