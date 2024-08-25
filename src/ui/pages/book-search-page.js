import { queryStore } from "../../core/queryStore";
import { getBookList } from "../../core/repository";
import stateManager from "../../core/stateManager";

export class BookSearchPage extends HTMLElement {
  constructor() {
    super();

    this.button = null;

    this.queryUnsubscribe = null;
    this.requestStatus = "";

    this.search = "";
    this.searchUnsubscribe = "";
  }

  connectedCallback() {
    this.render();

    this.searchUnsubscribe = stateManager.subscribe(({ search }) => {
      this.search = search;
      this.render();
    });
  }

  setupEventListeners() {
    this.button = document.querySelector(".requestButton");
    this.makeRequest = this.makeRequest.bind(this);

    if (this.button) this.button.addEventListener("click", this.makeRequest);
  }

  disconnectedCallback() {
    this.button.removeEventListener("click", this.makeRequest);

    this.queryUnsubscribe && this.queryUnsubscribe();
    this.searchUnsubscribe && this.searchUnsubscribe();
  }

  makeRequest() {
    const queryKey = ["books", "Java", "1", "20"];

    this.queryUnsubscribe = queryStore.subscribe(queryKey, (response) => {
      this.requestStatus = response.status;

      if (response.data) {
        this.books = response.data;
      }

      this.render();
    });

    queryStore.query({
      queryKey,
      queryFn: async (_, searchTerms, page, limit) => {
        return getBookList(searchTerms, page, limit);
      },
    });
  }

  render() {
    const styling = /*css*/ ``;

    this.innerHTML = /*html*/ `
      <style>
        ${styling}
      </style>

      <h1>Search page</h1>
      <search-bar-component></search-bar-component></br>
      <small>${this.search ? this.search : "Search something bro..."}</small></br>

      </br>

      <button class="requestButton">Request books page 1</button></br>

      <p>${this.requestStatus}</p>

      <ul>
        ${
          this.books
            ? this.books
                .map(
                  (book) => /*html*/ `
                  <li>${book.title}</li> 
                `
                )
                .join("")
            : "You need to make a search"
        }
      </ul>
    `;

    this.setupEventListeners()
  }
}
