const viewport = document.querySelector(".projects-viewport");
const track = document.querySelector(".project-track");
const cards = Array.from(document.querySelectorAll(".project-card"));

const groupSize = 5;           // cantidad de proyectos únicos
const middleStart = groupSize; // comenzamos en el grupo del medio
const middleEnd = groupSize * 2 - 1;

let currentIndex = middleStart;
let autoplay = null;

const stepDuration = 3200;     // pausa entre muestras
const transitionDuration = 850;

function setTrackPadding() {
  if (!viewport || !cards.length) return;

  const cardWidth = cards[0].offsetWidth;
  const sidePadding = Math.max(24, (viewport.clientWidth - cardWidth) / 2);

  track.style.paddingLeft = `${sidePadding}px`;
  track.style.paddingRight = `${sidePadding}px`;
}

function updateCarousel(animate = true) {
  if (!viewport || !track || !cards.length) return;

  setTrackPadding();

  cards.forEach((card, index) => {
    card.classList.toggle("active", index === currentIndex);
  });

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

viewport.addEventListener("mouseenter", stopAutoplay);
viewport.addEventListener("mouseleave", startAutoplay);
