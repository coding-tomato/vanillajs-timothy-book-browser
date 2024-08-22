const styling = /*css*/ ``;

const template = /*html*/ `
  <style>
    ${styling}
  </style>

  <h1>Search page</h1>
`;

export class BookSearchPage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = template;
  }
}
