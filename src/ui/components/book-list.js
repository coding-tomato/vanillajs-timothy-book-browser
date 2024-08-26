import { queryStore } from "../../core/queryStore";
import stateManager from "../../core/stateManager";

export class BookListComponent extends HTMLElement {
  constructor() {
    super();
    this.requestStatus = "";
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
        (response) => {
          this.requestStatus = response.status;

          if (response.data) {
            this.books = response.data;
          }

          this.render();
        }
      );
      this.queryUnsubscribe = unsubscribe;
      this.books = cacheEntry.data;

      this.render();
    });
  }

  disconnectedCallback() {
    this.queryUnsubscribe && this.queryUnsubscribe();
    this.searchUnsubscribe && this.searchUnsubscribe();
  }

  render() {
    const styling = /*css*/ `
      .book-list {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
      }
    `;

    this.innerHTML = /*html*/ `
      <style>
        ${styling}
      </style>
      <p>${this.requestStatus}</p>

      <ul class="book-list">
        ${
          this.books
            ? this.books
                .map(
                  (book) => /*html*/ `
                    <book-card-component
                      title='${book.title}'
                      author-name='${book.authorName}'
                      cover-id='${book.coverId}'
                    ></book-card-component>
                  `
                )
                .join("")
            : "You need to make a search"
        }
      </ul>
    `;
  }
}
