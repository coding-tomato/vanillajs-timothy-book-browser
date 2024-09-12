import { queryStore } from "@/core/queryStore";
import { getBookCover, getBookDetails } from "@/core/repository";
import stateManager from "@/core/stateManager";
import { routerInstance } from "../router";

export class BookDetailPage extends HTMLElement {
  constructor() {
    super();
    this.searchUnsubscribe = null;
    this.imgSrc = null;
  }

  connectedCallback() {
    this.render();

    this.searchUnsubscribe = stateManager.subscribe(async (state) => {
      const { detailBookId, detailBookCoverId } = state;

      await this.loadData(detailBookId);
      await this.loadCover(detailBookCoverId);

      this.render();
    });
  }

  disconnectedCallback() {
    this.searchUnsubscribe && this.searchUnsubscribe();
  }

  async loadData(detailBookId) {
    if (!detailBookId) {
      this.bookData = "ErrorNoBookDetailId";
      return;
    }

    const queryKey = ["detail", detailBookId];
    const response = await queryStore.query({
      queryKey,
      queryFn: async (_, detailBookId) => {
        return getBookDetails(detailBookId);
      },
    });
    this.bookData = response.data;
  }

  async loadCover(coverId) {
    if (coverId === "undefined" || this.imgSrc !== null) {
      return;
    }

    const queryKey = ["covers", "L", coverId];
    const response = await queryStore.query({
      queryKey,
      queryFn: async (_, size, coverId) => {
        return getBookCover(coverId, size);
      },
    });
    const imageUrl = response.data;
    this.imgSrc = imageUrl;
  }

  render() {
    if (this.bookData === "ErrorNoBookDetailId") {
      routerInstance.navigate("/");
      return;
    }

    const styling = /*css*/ `
      :host {
        animation: fadeIn 0.5s ease-in;
      }
      .cover {
        position: relative;
        width: 100%;
        height: 30rem;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .cover img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);

        animation: fadeIn 0.5s ease-in;
      }
      .cover p {
        opacity: 0.4;
      }

      ul {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        list-style-type: none;
        padding: 0;
        margin: 0;
        margin-bottom: 10rem;
      }
      li {
        background-color: #DADADA;
        padding: 0 0.25rem 0 0.25rem;
        margin: 0;
      }

      .loading {
        height: 70vh;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0.6;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    `;

    if (!this.bookData) {
      this.innerHTML = /*html*/ `
        <style>
          ${styling}
        </style>
        <p class="loading">Loading...</p>
      `;
      return;
    }

    this.innerHTML = /*html*/ `
      <style>
        ${styling}
      </style>

      <h1>${this.bookData.title}</h1>
      <hr/>

      <div class="cover fade-in">
        ${
          this.imgSrc
            ? /*html*/ `
            <img
              id="coverImage"
              alt="Book cover for ${this.bookData.title}"
              src=${this.imgSrc}
            >`
            : ""
        }
        ${this.imgSrc == null ? "<p>Book with no cover</p>" : ""}
      </div>
      <p>${this.bookData.description?.value || ""}</p>
      <h2>Subjects</h2>
      <ul>
        ${Array.isArray(this.bookData.subjects) ? this.bookData.subjects.map((subject) => `<li>${subject}</li>`).join(" ") : "No subjects"}
      </ul>
    `;
  }
}
