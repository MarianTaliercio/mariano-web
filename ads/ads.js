const carousel = document.getElementById("carousel");
const cards = Array.from(carousel.children);
const dotsContainer = document.getElementById("dots");

let index = 0;

// Crear dots dinámicamente
cards.forEach((_, i) => {
  const dot = document.createElement("div");
  dot.classList.add("dot");
  if (i === 0) dot.classList.add("active");
  dotsContainer.appendChild(dot);
});

// Actualizar visualización
function update() {
  cards.forEach((card, i) => {
    card.classList.remove("left", "center", "right");

    if (i === index) card.classList.add("center");
    else if (i === (index - 1 + cards.length) % cards.length) card.classList.add("left");
    else if (i === (index + 1) % cards.length) card.classList.add("right");
  });

  // Marcar dot activo
  document.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

// Botón siguiente
document.getElementById("next").addEventListener("click", () => {
  index = (index + 1) % cards.length;
  update();
});

// Botón anterior
document.getElementById("prev").addEventListener("click", () => {
  index = (index - 1 + cards.length) % cards.length;
  update();
});

update();

