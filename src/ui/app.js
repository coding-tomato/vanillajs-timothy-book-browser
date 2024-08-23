export class AppRoot extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const styling = /*css*/ `
      :host {
        width: 100%;
        display: flex;
        flex-direction: column;
      }
    `;

    this.innerHTML = /*html*/ `
      <style>
        ${styling}
      </style>

      <nav>
        <a href="/">Home</a>
        <a href="/books">Books</a>
        <a href="/nonexistent">Nonexistent Page</a>
      </nav>

      <router-component id="router"></router-component>
    `;
  }
}
