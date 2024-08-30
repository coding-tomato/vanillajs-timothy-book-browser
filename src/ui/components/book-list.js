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
    this.searchUnsubscribe = stateManager.subscribe((state) => {
      const { searchQueryKey } = state;

      if (!searchQueryKey) {
        return;
      }

      const [cacheEntry, unsubscribe] = queryStore.subscribe(
        searchQueryKey,
        (cacheEntry) => {
          this.requestStatus = cacheEntry.status;

          if (cacheEntry.data) {
            this.books = cacheEntry.data.books;
          }

          this.render();
        }
      );

      this.queryUnsubscribe = unsubscribe;
      this.books = cacheEntry ? cacheEntry.data.books : null;

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
        justify-content: center;
        gap: 1rem;
        padding: 0;
        padding-bottom: 10rem;
      }

      p {
        width: 100%;
        text-align: center;
        opacity: 0.5;
      }
    `;

    const booksExist = Boolean(this.books && this.books.length > 0);
    const noBooksFound = Boolean(this.books && this.books.length === 0);
    const booksLoading = !Boolean(this.books);

    this.innerHTML = /*html*/ `
      <style>
        ${styling}
      </style>

      ${this.requestStatus === "loading" ? /*html*/ `<p>Cargando...</p>` : ""}

      <ul class="book-list">
        ${
          booksExist
            ? this.books
                .map(
                  (book) => /*html*/ `
                    <book-card-component
                      id='${book.id}'
                      title='${book.title}'
                      author-name='${book.authorName}'
                      cover-id='${book.coverId}'
                    ></book-card-component>
                  `
                )
                .join("")
            : ""
        }

        ${noBooksFound ? "There are no books with that search" : ""}
        ${booksLoading ? "Loading..." : ""}
      </ul>
    `;
  }
}
