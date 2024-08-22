const styling = /*css*/ ``;

const template = /*html*/ `
  <style>
    ${styling}
  </style>

  <h1>Ooops... This page doesn't exist</h1>
  <a href="/">Return home</a>
`;

export class NotFoundPage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = template;
  }
}
