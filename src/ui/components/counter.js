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

  <p>Hello World! Count: <span class="count">0</span></p>
  <button class="increment">Increment</button>
`;

export class CounterComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.count = 0;
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = template;

    this.shadowRoot
      .querySelector(".increment")
      ?.addEventListener("click", () => this.incrementCount());
  }

  incrementCount() {
    this.count++;
    this.render();
  }

  render() {
    const element = this.shadowRoot.querySelector(".count");

    if (element) {
      element.textContent = this.count.toString();
    }
  }
}
