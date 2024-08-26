export class BookCardComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ["title", "cover-id", "author-name"];
  }
  get coverId() {
    return this.getAttribute("cover-id");
  }
  get title() {
    return this.getAttribute("title");
  }

  render() {
    const styling = /*css*/ `
      :host {
        width: 15rem;
        height: 20rem;
        background-color: #FDFDFD;
        border-radius: 0.75rem;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        border: 1px solid #F0F0F0;
      }
    `;

    const template = /*html*/ `
      <style>
        ${styling}
      </style>

      <p>${this.title}</p>
    `;

    this.shadowRoot.innerHTML = template;
  }
}
