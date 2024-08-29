// Scrollbar gutter on the side to eliminate layout shifts
function adjustForScrollbar() {
  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;
  document.body.style.paddingRight = `${scrollbarWidth}px`;
  document.body.style.overflowY = "scroll";
}

export function config() {
  adjustForScrollbar();
}
