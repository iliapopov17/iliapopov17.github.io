(function () {
  const PATH = "/cv";

  function isCvPage() {
    return window.location.pathname.replace(/\/+$/, "") === PATH;
  }

  function $(sel) {
    return document.querySelector(sel);
  }

  function init() {
    if (!isCvPage()) return;

    const iframe = document.getElementById("cv-pdf");
    if (!iframe) return;

    const masthead = $(".masthead") || $("header.masthead") || $("header");
    const footerWrap = $(".page__footer") || $("footer");

    // basic inline styles (no custom.scss)
    iframe.style.display = "block";
    iframe.style.border = "0";
    iframe.style.width = "100%";

    function fit() {
      const vh = window.innerHeight;
      const gap = 8; // safety gap to avoid 1px scroll due to rounding

      // 1) start with "fill remaining space under iframe top"
      const top = iframe.getBoundingClientRect().top;
      let h = Math.max(200, Math.floor(vh - top - gap));
      iframe.style.height = h + "px";

      // 2) if footer is below viewport, shrink iframe so footer becomes visible
      if (footerWrap) {
        const footerBottom = footerWrap.getBoundingClientRect().bottom;
        const overflow = footerBottom - vh + gap;

        if (overflow > 0) {
          h = Math.max(200, h - Math.ceil(overflow));
          iframe.style.height = h + "px";
        }
      }

      // 3) If masthead height changes after layout settles, repeat once
      // (Safari can do reflow after fonts)
      // This is cheap, but prevents edge cases.
      requestAnimationFrame(() => {
        if (!footerWrap) return;
        const footerBottom2 = footerWrap.getBoundingClientRect().bottom;
        const overflow2 = footerBottom2 - vh + gap;
        if (overflow2 > 0) {
          const cur = parseInt(iframe.style.height, 10) || h;
          iframe.style.height = Math.max(200, cur - Math.ceil(overflow2)) + "px";
        }
      });

      // 4) Now that everything fits, disable page scrolling on /cv/
      // (footer won't be cut because we just ensured it's inside viewport)
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    }

    fit();
    window.addEventListener("resize", fit, { passive: true });
    window.addEventListener("load", fit, { passive: true });

    if ("ResizeObserver" in window) {
      const ro = new ResizeObserver(fit);
      ro.observe(document.documentElement);
      if (masthead) ro.observe(masthead);
      if (footerWrap) ro.observe(footerWrap);
    }
  }

  init();
})();
