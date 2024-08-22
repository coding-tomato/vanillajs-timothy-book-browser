const styling = /*css*/ `
  :host {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

const template = /*html*/ `
  <style>
    ${styling}
  </style>

  <h1>App</h1>
  <counter-component></counter-component>
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
