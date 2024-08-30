import { queryStore } from "@/core/queryStore";
import stateManager from "@/core/stateManager";

export class PaginationComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.currentPage = 1;
    this.pageCount = null;

    this.queryUnsubscribe = null;
    this.searchUnsubscribe = null;
  }

  connectedCallback() {
    this.render();

    this.searchUnsubscribe = stateManager.subscribe((state) => {
      const { searchQueryKey } = state;

      if (!searchQueryKey) {
        return;
      }

      const [cacheEntry, unsubscribe] = queryStore.subscribe(
        searchQueryKey,
        (cacheEntry) => {
          if (cacheEntry.data) {
            this.pageCount = cacheEntry.data.pageCount;
          }

          this.render();
        }
      );

      this.queryUnsubscribe = unsubscribe;
      this.pageCount = cacheEntry?.data ? cacheEntry.data.pageCount : 1;

      this.render();
    });
  }

  disconnectedCallback() {
    this.queryUnsubscribe && this.queryUnsubscribe();
    this.searchUnsubscribe && this.searchUnsubscribe();
  }

  setupEventListeners() {
    this.shadowRoot
      .querySelector("#prevPageButton")
      .addEventListener("click", this.prevPage);

    this.shadowRoot
      .querySelector("#nextPageButton")
      .addEventListener("click", this.nextPage);
  }

  setPageState(newPage) {
    this.currentPage = newPage;
    const searchQueryKeyClone = [...stateManager.getState().searchQueryKey];
    searchQueryKeyClone[2] = newPage;
    stateManager.setState({ searchQueryKey: searchQueryKeyClone });
  }

  prevPage = () => {
    this.setPageState(this.currentPage - 1);
  };

  nextPage = () => {
    this.setPageState(this.currentPage + 1);
  };

  render() {
    const styling = /*css*/ `
      :host {
        width: 100%;
        display: flex;
        justify-content: center;
        gap: 1rem;
      }
    `;

    const template = /*html*/ `
      <style>
        ${styling}
      </style>
    
      <button id="prevPageButton" ${this.currentPage === 1 ? "disabled" : ""}> < </button>
      <button id="nextPageButton" ${this.currentPage === this.pageCount ? "disabled" : ""}> > </button>
    `;

    this.shadowRoot.innerHTML = template;
    this.setupEventListeners();
  }
}
