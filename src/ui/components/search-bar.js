import { queryStore } from "@/core/queryStore";
import { getBookList } from "@/core/repository";
import stateManager from "@/core/stateManager";

export class SearchBarComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.input = null;
    this.button = null;
  }

  connectedCallback() {
    this.render();

    const [, searchTerms] = stateManager.getState().searchQueryKey;
    this.shadowRoot.querySelector("input").value = searchTerms.toString();
    this.searchUnsubscribe = stateManager.subscribe((state) => {
      const { searchQueryKey } = state;
      this.performSearch(searchQueryKey);
      this.render();
    });
  }

  setupEventListeners() {
    this.input = this.shadowRoot.querySelector("input");
    this.button = this.shadowRoot.querySelector("button");

    this.button.addEventListener("click", this.updateState);
    this.input.addEventListener("keyup", this.handleKeyboardInput);
  }

  handleKeyboardInput = (e) => {
    if (e.key === "Enter") this.updateState();
  };
  updateState = () => {
    const searchTerms = this.shadowRoot.querySelector("input").value;
    if (searchTerms === "") return;

    const searchQueryKeyClone = [...stateManager.getState().searchQueryKey];
    searchQueryKeyClone[1] = searchTerms; // Introducing search terms
    searchQueryKeyClone[2] = 1; // Restarting to initial page on search
    stateManager.setState({ searchQueryKey: searchQueryKeyClone });
  };

  performSearch = (searchQueryKey) => {
    queryStore.query({
      queryKey: searchQueryKey,
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
    this.setupEventListeners();
  }
}
