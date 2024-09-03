export class HomePageComponent extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const styling = /*css*/ `
      home-component-page {
        width: 100%;
        min-height: 70dvh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      h1 {
        margin: 0;
        font-size: 4rem;
        line-height: 6rem;
        font-weight: 700;
      }

      .title-container {
        margin-top: 1rem;
        animation: fadeIn 0.5s ease-out;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(1rem);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;

    this.innerHTML = /*html*/ `
      <style>
        ${styling}
      </style>

      <div class="title-container">
        <h1 class="serif-font">Timothy Book Browser</h1>
        <small>Powered by Open Library and Web Components</small>
        <hr/>
        <search-bar-component></search-bar-component>
      </div>
    `;
  }
}
