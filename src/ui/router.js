import { BookDetailPage } from "./pages/book-detail-page";
import { BookSearchPage } from "./pages/book-search-page";
import { HomePageComponent } from "./pages/home-page";
import { NotFoundPage } from "./pages/not-found-page";

export class RouterComponent extends HTMLElement {
  constructor() {
    super();
    this.routes = new Map();
    this.currentRoute = "";
    this.notFoundComponent = "not-found-page";

    routerInstance.setComponent(this);
  }

  connectedCallback() {
    this.addRoute("/", "home-component-page");
    this.addRoute("/books", "book-search-page");
    this.addRoute("/books/detail", "book-detail-page");

    this.render();

    window.addEventListener("popstate", () => this.render());

    // Creates a listener for all click events, detects if
    // the click was on an <a> tag, in which case triggers
    // Navigation
    window.addEventListener("click", (e) => {
      const path = e.composedPath();
      const anchor = path.find((el) => el.tagName === "A");

      if (anchor) {
        const newRoute = anchor.getAttribute("href");

        if (newRoute !== this.currentRoute && this.routes.has(newRoute)) {
          e.preventDefault();
          this.navigate(newRoute);
        }
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
    this.currentRoute = path;
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

class RouterInstance {
  constructor() {
    this.component = null;
  }

  setComponent(component) {
    this.component = component;
  }

  navigate(path) {
    if (this.component) {
      this.component.navigate(path);
    } else {
      console.error("Router component not set");
    }
  }
}

export const routerInstance = new RouterInstance();

customElements.define("home-component-page", HomePageComponent);
customElements.define("book-search-page", BookSearchPage);
customElements.define("book-detail-page", BookDetailPage);
customElements.define("not-found-page", NotFoundPage);
