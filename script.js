// ==============================
// STACK EFFECT (inicio/products/about)
// ==============================
const stackSections = document.querySelectorAll(".inicio, .products, .about");

function atualizarStack() {
  stackSections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const progresso = (-rect.top) / window.innerHeight;

    if (progresso > 0 && progresso < 1) {
      const escala = 1 - progresso * 0.08;
      const opacidade = 1 - progresso * 0.4;

      section.style.transform = `scale(${escala})`;
      section.style.opacity = opacidade;
      section.style.borderRadius = "20px";
    }

    if (progresso <= 0) {
      section.style.transform = "scale(1)";
      section.style.opacity = "1";
      section.style.borderRadius = "0px";
    }
  });
}

window.addEventListener("scroll", atualizarStack);


// ==============================
// GALLERY ANIMATION
// ==============================
let lastScrollY = window.scrollY;
const galleryItems = document.querySelectorAll(".gallery-item");

const galleryObserver = new IntersectionObserver((entries) => {
  const currentScrollY = window.scrollY;
  const scrollingDown = currentScrollY > lastScrollY;

  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      entry.target.style.transform = "translateY(0)";
    } else {
      entry.target.classList.remove("show");

      if (scrollingDown) {
        entry.target.style.transform = "translateY(70px)";
      } else {
        entry.target.style.transform = "translateY(-70px)";
      }
    }
  });

  lastScrollY = currentScrollY;
}, { threshold: 0.15 });

galleryItems.forEach((item) => {
  galleryObserver.observe(item);
});


// ==============================
// SCROLL NAVEGAÇÃO
// ==============================
const btnInicio = document.getElementById("btn-inicio");
if (btnInicio) {
  btnInicio.addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("inicio")?.scrollIntoView({ behavior: "smooth" });
  });
}

const btnServicos = document.getElementById("btn-servicos");
if (btnServicos) {
  btnServicos.addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("servicos")?.scrollIntoView({ behavior: "smooth" });
  });
}

const btnSobre = document.getElementById("btn-sobre");
if (btnSobre) {
  btnSobre.addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("sobre")?.scrollIntoView({ behavior: "smooth" });
  });
}

const btnAgendamento = document.getElementById("btn-agendamento");
if (btnAgendamento) {
  btnAgendamento.addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("agendamento")?.scrollIntoView({ behavior: "smooth" });
  });
}


// ==============================
// FILTRO DA GALERIA
// ==============================
const filterBtns = document.querySelectorAll(".filter-btn");

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const filtro = btn.dataset.filter;
    const cardDestaque = document.querySelector(".gallery-item-destaque");

    // O Card amarelo só aparece em "todos"
    if (cardDestaque) {
      cardDestaque.style.display = (filtro === "todos") ? "flex" : "none";
    }

    galleryItems.forEach(item => {
      // Ignora o card de destaque
      if (item.classList.contains("gallery-item-destaque")) return;

      const categorias = item.dataset.category
        ? item.dataset.category.split(" ")
        : [];

      if (filtro === "todos") {
        item.style.display = "block";
      } else {
        if (categorias.includes(filtro)) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      }
    });
  });
});
