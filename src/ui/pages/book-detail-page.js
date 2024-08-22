const styling = /*css*/ ``;

const template = /*html*/ `
  <style>
    ${styling}
  </style>

  <h1>Detail page</h1>
`;

export class BookDetailPage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = template;
  }
}

