import { config } from "./config";

import { AppRoot } from "./ui/app";
import { BookCardComponent } from "./ui/components/book-card";
import { BookListComponent } from "./ui/components/book-list";
import { SearchBarComponent } from "./ui/components/search-bar";
import { RouterComponent } from "./ui/router";

import "./style.css";

config();

// Bootstrap
window.customElements.define("router-component", RouterComponent);
window.customElements.define("app-root", AppRoot);

// Components
window.customElements.define("search-bar-component", SearchBarComponent);
window.customElements.define("book-card-component", BookCardComponent);
window.customElements.define("book-list-component", BookListComponent);
