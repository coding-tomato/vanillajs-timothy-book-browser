const styling = /*css*/ `
  :host {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
`;

const template = /*html*/ `
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

export default class AppRoot extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this._shadowRoot.innerHTML = template;
  }
}
