const styling = /*css*/ `
  :host {
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

  <p>Hello World 2! Count 2: <span class="count">0</span></p>
  <button class="increment">Increment</button>
`;

export default class CounterComponent2 extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
    this.count = 0;
  }

  connectedCallback() {
    this._shadowRoot.innerHTML = template;

    this._shadowRoot
      .querySelector(".increment")
      ?.addEventListener("click", () => this.incrementCount());
  }

  incrementCount() {
    this.count++;
    this.render();
  }

  render() {
    const element = this._shadowRoot.querySelector(".count");

    if (element) {
      element.textContent = this.count.toString();
    }
  }
}
