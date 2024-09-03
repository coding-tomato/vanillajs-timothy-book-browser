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
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      }

      nav {
        margin: 0.5rem 0 0.5rem;
      }
    `;

    this.innerHTML = /*html*/ `
      <style>
        ${styling}
      </style>

      <div class="container">
        <nav>
          .. / <a href="/">Home</a> /
          <a href="/books">Books</a>
        </nav>

        <main>
          <router-component id="router"></router-component>
        </main>
      </div>
    `;
  }
}
