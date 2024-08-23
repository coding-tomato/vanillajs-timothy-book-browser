export class BookDetailPage extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const styling = /*css*/ ``;

    this.innerHTML = /*html*/ `
      <style>
        ${styling}
      </style>

      <h1>Detail page</h1>
    `;
  }
}
