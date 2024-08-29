export class AppRoot extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const styling = /*css*/ `
      app-root {
        width: 100%;
        min-height: 100dvh;
        display: flex;
        justify-content: center;
      }

      .container {
        width: 100%;
        max-width: 1280px;
        border: 1px solid #DADADA;
        padding: 0 1rem 0 1rem;
      }
    `;

    this.innerHTML = /*html*/ `
      <style>
        ${styling}
      </style>

      <div class="container">
        <nav>
          <a href="/">Home</a>
          <a href="/books">Books</a>
          <a href="/nonexistent">Nonexistent Page</a>
        </nav>

        <router-component id="router"></router-component>
      </div>
    `;
  }
}
