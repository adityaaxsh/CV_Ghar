(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  document.addEventListener("click", (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) return;

    const link = event.target.closest("a[href]");
    if (!link || link.target || link.hasAttribute("download")) return;

    const destination = new URL(link.href, window.location.href);
    if (
      destination.origin !== window.location.origin ||
      destination.pathname !== window.location.pathname ||
      destination.search !== window.location.search ||
      !destination.hash
    ) return;

    const target = document.getElementById(decodeURIComponent(destination.hash.slice(1)));
    if (!target) return;

    event.preventDefault();
    if (window.location.hash !== destination.hash) {
      window.history.pushState(null, "", destination.hash);
    }

    const start = window.scrollY;
    const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const end = Math.max(0, target.getBoundingClientRect().top + start - offset);
    const distance = end - start;

    if (reducedMotion.matches || Math.abs(distance) < 2) {
      window.scrollTo(0, end);
      return;
    }

    const duration = Math.min(1500, Math.max(550, 420 + Math.sqrt(Math.abs(distance)) * 19));
    const startTime = performance.now();
    const easeOutQuint = (progress) => 1 - Math.pow(1 - progress, 5);

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      window.scrollTo(0, start + distance * easeOutQuint(progress));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  });
})();
