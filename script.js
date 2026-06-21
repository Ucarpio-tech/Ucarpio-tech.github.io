const viewport = document.querySelector(".projects-viewport");
const track = document.querySelector(".project-track");
const cards = Array.from(document.querySelectorAll(".project-card"));

const groupSize = 5;
const middleStart = groupSize;
const middleEnd = groupSize * 2 - 1;

let currentIndex = middleStart;
let autoplay = null;

const stepDuration = 2400;       // más rápido entre muestras
const transitionDuration = 720;  // transición más ágil

function setTrackPadding() {
  if (!viewport || !cards.length) return;

  const cardWidth = cards[0].offsetWidth;
  const sidePadding = Math.max(16, (viewport.clientWidth - cardWidth) / 2);

  track.style.paddingLeft = `${sidePadding}px`;
  track.style.paddingRight = `${sidePadding}px`;
}

function clearCardStates() {
  cards.forEach((card) => {
    card.classList.remove(
      "active",
      "left-near",
      "right-near",
      "left-far",
      "right-far",
      "muted"
    );
  });
}

function applyCardStates() {
  clearCardStates();

  cards.forEach((card, index) => {
    const diff = index - currentIndex;

    if (diff === 0) {
      card.classList.add("active");
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
  });
}

function updateCarousel(animate = true) {
  if (!viewport || !track || !cards.length) return;

  setTrackPadding();
  applyCardStates();

  const activeCard = cards[currentIndex];
  const activeCenter = activeCard.offsetLeft + activeCard.offsetWidth / 2;
  const viewportCenter = viewport.clientWidth / 2;
  const targetX = activeCenter - viewportCenter;

  track.style.transition = animate
    ? `transform ${transitionDuration}ms cubic-bezier(0.22, 1, 0.36, 1)`
    : "none";

  track.style.transform = `translateX(${-targetX}px)`;
}

function nextSlide() {
  currentIndex += 1;
  updateCarousel(true);

  if (currentIndex > middleEnd) {
    setTimeout(() => {
      currentIndex = middleStart;
      updateCarousel(false);
    }, transitionDuration + 20);
  }
}

function startAutoplay() {
  stopAutoplay();
  autoplay = setInterval(nextSlide, stepDuration);
}

function stopAutoplay() {
  if (autoplay) {
    clearInterval(autoplay);
    autoplay = null;
  }
}

window.addEventListener("load", () => {
  updateCarousel(false);
  startAutoplay();
});

window.addEventListener("resize", () => {
  updateCarousel(false);
});

if (viewport) {
  viewport.addEventListener("mouseenter", stopAutoplay);
  viewport.addEventListener("mouseleave", startAutoplay);
}

cards.forEach((card, index) => {
  card.addEventListener("click", () => {
    stopAutoplay();

    currentIndex = index;
    updateCarousel(true);

    setTimeout(() => {
      if (currentIndex < middleStart) {
        currentIndex += groupSize;
        updateCarousel(false);
      } else if (currentIndex > middleEnd) {
        currentIndex -= groupSize;
        updateCarousel(false);
      }

      startAutoplay();
    }, transitionDuration + 20);
  });
});
