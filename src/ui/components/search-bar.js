import stateManager from "../../core/stateManager";

const styling = /*css*/ ``;

const template = /*html*/ `
  <style>
    ${styling}
  </style>

  <input type="text" placeholder="Search..."/>
  <button>Search</button>
`;

export class SearchBarComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.input = null;
    this.button = null;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  disconnectedCallback() {
    this.clearEventListeners();
  }

  setupEventListeners() {
    this.input = this.shadowRoot.querySelector("input");
    this.button = this.shadowRoot.querySelector("button");

    this.search = this.search.bind(this);
    this.keyboardSearch = this.keyboardSearch.bind(this);

    this.button.addEventListener("click", this.search);
    this.input.addEventListener("keyup", this.keyboardSearch);
  }

  clearEventListeners() {
    this.button.removeEventListener("click", this.search);
    this.input.removeEventListener("keyup", this.keyboardSearch);
  }

  keyboardSearch(e) {
    if (e.key === "Enter") this.search();
  }

  search() {
    const query = this.shadowRoot.querySelector("input").value;
    if (query === "") return;
    stateManager.setState({ search: query });
  }

  render() {
    this.shadowRoot.innerHTML = template;
  }
}
