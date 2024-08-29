import { queryStore } from "../../core/queryStore";
import { getBookList } from "../../core/repository";
import stateManager from "../../core/stateManager";

const PAGE_LIMIT = 20;

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

    this.shadowRoot.querySelector("input").value = "Test";
    this.performSearch();
  }

  disconnectedCallback() {
    this.clearEventListeners();
  }

  setupEventListeners() {
    this.input = this.shadowRoot.querySelector("input");
    this.button = this.shadowRoot.querySelector("button");

    this.button.addEventListener("click", this.performSearch);
    this.input.addEventListener("keyup", this.handleKeyboardInput);
  }

  handleKeyboardInput = (e) => {
    if (e.key === "Enter") this.performSearch();
  };
  performSearch = () => {
    const searchTerms = this.shadowRoot.querySelector("input").value;
    if (searchTerms === "") return;

    const queryKey = ["books", searchTerms, "1", PAGE_LIMIT];
    stateManager.setState({ searchQueryKey: queryKey });

    queryStore.query({
      queryKey,
      queryFn: async (_, searchTerms, page, limit) => {
        return getBookList(searchTerms, page, limit);
      },
    });
  };

  render() {
    const styling = /*css*/ ``;

    const template = /*html*/ `
      <style>
        ${styling}
      </style>
    
      <input type="text" placeholder="Search..."/>
      <button>Search</button>
    `;

    this.shadowRoot.innerHTML = template;
  }
}
