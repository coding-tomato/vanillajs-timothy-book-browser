import { getBookCover } from "../../core/repository";
import { routerInstance } from "../router";

export class BookCardComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.buttonDiv = null;
    this.imgSrc = null;
  }

  connectedCallback() {
    this.render();
    this.loadCover();
  }

  setupEventListeners() {
    this.shadowRoot.addEventListener("click", this.navigate);
  }

  static get observedAttributes() {
    return ["id", "title", "cover-id", "author-name"];
  }
  get id() {
    return this.getAttribute("id");
  }
  get coverId() {
    return this.getAttribute("cover-id");
  }
  get title() {
    return this.getAttribute("title");
  }

  async loadCover() {
    if (this.coverId === "undefined") {
      return;
    }

    const imageUrl = await getBookCover(this.coverId, "M");
    this.imgSrc = imageUrl;

    this.render();
  }

  navigate = () => {
    routerInstance.navigate(`/books/${this.id}`);
  };

  render() {
    const styling = /*css*/ `
      :host {
        display: flex;
        flex-direction: column;
        width: 15rem;
        height: 20rem;
        background-color: #FDFDFD;
        border-radius: 0.75rem;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        border: 1px solid #F0F0F0;
        padding: 0.25rem;
      }

      .cover {
        position: relative;
        flex-grow: 1;
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
      }
      .cover p {
        opacity: 0.4;
      }

      .info {
        flex-shrink: 0;
        padding: 0.25rem;
      }
    `;

    const template = /*html*/ `
      <style>
        ${styling}
      </style>

      <div class="cover">
        ${this.coverId !== "undefined" && this.imgSrc === null ? "<p>Cargando...</p>" : ""}
        ${
          this.coverId !== "undefined" && this.imgSrc !== null
            ? `<img id="coverImage" alt="Book cover for ${this.title}" src=${this.imgSrc}>`
            : ""
        }
        ${this.coverId === "undefined" ? "<p>Book with no cover</p>" : ""}
      </div>

      <div class="info">
        <p>${this.title}</p>
      </div>
    `;

    this.shadowRoot.innerHTML = template;
    this.setupEventListeners();
  }
}