import { BookDetailPage } from "./pages/book-detail-page";
import { BookSearchPage } from "./pages/book-search-page";
import { HomePageComponent } from "./pages/home-page";
import { NotFoundPage } from "./pages/not-found-page";

export class RouterComponent extends HTMLElement {
  constructor() {
    super();
    this.routes = new Map();
    this.notFoundComponent = null;
  }

  connectedCallback() {
    this.addRoute("/", "home-component-page");
    this.addRoute("/books", "book-search-page");
    this.addRoute("/books/detail", "books-detail-page");
    this.setNotFound("not-found-page");

    this.render();

    window.addEventListener("popstate", () => this.render());

    this.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        e.preventDefault();
        this.navigate(e.target.getAttribute("href"));
      }
    });
  }

  addRoute(path, component) {
    this.routes.set(path, component);
  }

  setNotFound(component) {
    this.notFoundComponent = component;
  }

  navigate(path) {
    window.history.pushState(null, "", path);
    this.render();
  }

  render() {
    const path = window.location.pathname;
    let component = this.routes.get(path);

    if (!component && this.notFoundComponent) {
      component = this.notFoundComponent;
    }

    this.innerHTML = "";
    if (component) {
      const element = document.createElement(component);
      this.appendChild(element);
    }
  }
}

customElements.define("home-component-page", HomePageComponent);
customElements.define("book-search-page", BookSearchPage);
customElements.define("book-detail-page", BookDetailPage);
customElements.define("not-found-page", NotFoundPage);
