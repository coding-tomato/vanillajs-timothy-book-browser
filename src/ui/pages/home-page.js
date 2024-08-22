const styling = /*css*/ ``;

const template = /*html*/ `
  <style>
    ${styling}
  </style>

  <h1>Home page</h1>
  <counter-component></counter-component>
  <counter-component></counter-component>
`;

export class HomePageComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = template;
  }
}
