import "./style.css";
import AppRoot from "./ui/app";
import CounterComponent from "./ui/components/Counter";

window.customElements.define("app-root", AppRoot);
window.customElements.define("counter-component", CounterComponent);
