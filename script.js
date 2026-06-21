document.addEventListener("DOMContentLoaded", () => {
  const viewport = document.querySelector(".projects-viewport");
  const cards = Array.from(document.querySelectorAll(".project-card"));

  if (!viewport || cards.length === 0) {
    return;
  }

  const stateClasses = [
    "active",
    "left-near",
    "right-near",
    "left-far",
    "right-far",
    "muted"
  ];

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const displayDelay = 2300;
  const resumeDelay = 1200;

  let activeIndex = 0;
  let autoplayTimer = null;

  function wrappedIndex(index) {
    return (index + cards.length) % cards.length;
  }

  function shortestDiff(index) {
    let diff = index - activeIndex;
    const half = Math.floor(cards.length / 2);

    if (diff > half) {
      diff -= cards.length;
    }

    if (diff < -half) {
      diff += cards.length;
    }

    return diff;
  }

  function setCardState(card, diff, index) {
    card.classList.remove(...stateClasses);
    card.removeAttribute("aria-current");

    const control = card.querySelector(".project-select");

    if (diff === 0) {
      card.classList.add("active");
      card.setAttribute("aria-current", "true");
    } else if (diff === -1) {
      card.classList.add("left-near");
    } else if (diff === 1) {
      card.classList.add("right-near");
    } else if (diff === -2) {
      card.classList.add("left-far");
    } else if (diff === 2) {
      card.classList.add("right-far");
    } else {
      card.classList.add("muted");
    }

    if (control) {
      control.setAttribute("aria-pressed", String(index === activeIndex));
    }
  }

  function render() {
    cards.forEach((card, index) => {
      setCardState(card, shortestDiff(index), index);
    });
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      window.clearTimeout(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function startAutoplay(delay = displayDelay) {
    stopAutoplay();

    if (cards.length < 2 || prefersReducedMotion.matches) {
      return;
    }

    autoplayTimer = window.setTimeout(() => {
      activeIndex = wrappedIndex(activeIndex + 1);
      render();
      startAutoplay();
    }, delay);
  }

  function selectCard(index) {
    activeIndex = wrappedIndex(index);
    render();
    startAutoplay(resumeDelay);
  }

  cards.forEach((card, index) => {
    const control = card.querySelector(".project-select") || card;

    control.addEventListener("click", () => {
      selectCard(index);
    });
  });

  viewport.addEventListener("pointerenter", stopAutoplay);
  viewport.addEventListener("pointerleave", () => startAutoplay(resumeDelay));
  viewport.addEventListener("focusin", stopAutoplay);
  viewport.addEventListener("focusout", (event) => {
    if (!viewport.contains(event.relatedTarget)) {
      startAutoplay(resumeDelay);
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay(resumeDelay);
    }
  });

  const handleMotionChange = () => {
    render();
    startAutoplay(resumeDelay);
  };

  if (typeof prefersReducedMotion.addEventListener === "function") {
    prefersReducedMotion.addEventListener("change", handleMotionChange);
  } else if (typeof prefersReducedMotion.addListener === "function") {
    prefersReducedMotion.addListener(handleMotionChange);
  }

  render();
  startAutoplay();
});
