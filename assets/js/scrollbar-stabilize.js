(function () {
  function getScrollbarWidth() {
    const div = document.createElement("div");
    div.style.width = "100px";
    div.style.height = "100px";
    div.style.overflow = "scroll";
    div.style.position = "absolute";
    div.style.top = "-9999px";
    document.body.appendChild(div);
    const sbw = div.offsetWidth - div.clientWidth;
    document.body.removeChild(div);
    return sbw;
  }

  function apply() {
    const doc = document.documentElement;
    const hasVScroll = doc.scrollHeight > window.innerHeight + 1;
    const sbw = getScrollbarWidth();

    doc.style.setProperty("--sbw", sbw + "px");
    doc.classList.toggle("no-vscroll", !hasVScroll);
  }

  window.addEventListener("load", apply, { passive: true });
  window.addEventListener("resize", apply, { passive: true });
})();
