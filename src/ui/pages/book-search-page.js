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
      <small>${this.searchQueryKey ? this.searchQueryKey : "Search something bro..."}</small></br>

      </br>

      <book-list-component></book-list-component>
    `;
  }
}
