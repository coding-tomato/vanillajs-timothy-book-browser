import { queryStore } from "../../core/queryStore";
import { getBookList } from "../../core/repository";

const styling = /*css*/ ``;

const template = /*html*/ `
  <style>
    ${styling}
  </style>

  <h1>Home page</h1>

  <button class="requestButton">Request books page 1</button>

  <counter-component></counter-component>
  <counter-component></counter-component>
`;

export class HomePageComponent extends HTMLElement {
  constructor() {
    super();
    this.button = null;
  }

  connectedCallback() {
    this.innerHTML = template;

    this.button = this.querySelector(".requestButton");

    if (this.button) this.button.addEventListener("click", this.makeRequest);
  }

  disconnectedCallback() {
    this.button.removeEventListener("click", this.makeRequest);
  }

  async makeRequest(event) {
    console.log("Requesting", event);

    const data = await queryStore.query({
      key: ["books", "Java", "1"],
      queryFn: async (_, searchTerms, page) => {
        return getBookList(searchTerms, page);
      },
    });
  }
}
