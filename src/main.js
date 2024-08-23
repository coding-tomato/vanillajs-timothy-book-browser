import "./style.css";

import { AppRoot } from "./ui/app";
import { CounterComponent } from "./ui/components/counter";
import { SearchBarComponent } from "./ui/components/search-bar";
import { RouterComponent } from "./ui/router";

// Bootstrap
window.customElements.define("router-component", RouterComponent);
window.customElements.define("app-root", AppRoot);

// Components
window.customElements.define("counter-component", CounterComponent);
window.customElements.define("search-bar-component", SearchBarComponent);
