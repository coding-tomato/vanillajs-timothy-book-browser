export class NotFoundPage extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    const styling = /*css*/ ``;

    this.innerHTML = /*html*/ `
      <style>
        ${styling}
      </style>

      <h1>Ooops... This page doesn't exist</h1>
      <a href="/">Return home</a>
    `;
  }
}
