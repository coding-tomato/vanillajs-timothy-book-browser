export class HomePageComponent extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const styling = /*css*/ ``;

    this.innerHTML = /*html*/ `
      <style>
        ${styling}
      </style>

      <h1>Home page</h1>

      <search-bar-component></search-bar-component>

      <counter-component></counter-component>
      <counter-component></counter-component>
    `;
  }
}
